import { assignRoles } from "../game/assignRoles.js";
import { isVetoUnlocked } from "../game/board.js";
import { emitGameState } from "../game/emitGameState.js";
import { emitPrivateGameViews } from "../game/emitPrivateGameViews.js";
import { getGame } from "../game/gameService.js";
import type {
  AcknowledgePeekPayload,
  AcknowledgeRolePayload,
  CastVotePayload,
  ChancellorEnactPayload,
  ClientToServerEvents,
  ConfirmVetoPayload,
  ExecutiveActionPayload,
  PresidentDiscardPayload,
  RequestVetoPayload,
  SelectChancellorPayload,
  ServerToClientEvents,
  Vote,
} from "@secret-hitler/shared";
import type { Server, Socket } from "socket.io";
import { emitRoomUpdated } from "./broadcastRoom.js";
import { rooms } from "./roomStore.js";

type AppServer = Server<ClientToServerEvents, ServerToClientEvents>;
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export function handleStartGame(io: AppServer, socket: AppSocket, code: string) {
  const room = rooms.get(code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  const player = room.players.find((p) => p.socketId === socket.id);

  if (!player?.isHost) {
    socket.emit("error-message", "Solo el host puede iniciar la partida");
    return;
  }

  if (room.players.length < 5) {
    socket.emit("error-message", "Se necesitan mínimo 5 jugadores");
    return;
  }

  if (room.players.length > 10) {
    socket.emit("error-message", "Máximo 10 jugadores");
    return;
  }

  const game = getGame(code);

  if (!game) {
    socket.emit("error-message", "Juego no encontrado");
    return;
  }

  room.players = assignRoles(room.players);

  game.send({
    type: "START_GAME",
    playerSocketIds: room.players.map((player) => player.socketId),
    playerRoles: Object.fromEntries(
      room.players.map((player) => [player.socketId, player.role ?? "liberal"]),
    ),
  });

  emitRoomUpdated(io, room);
  emitPrivateGameViews(io, room, game);
  emitGameState(io, code, game);
}

export function handleAcknowledgeRole(
  io: AppServer,
  socket: AppSocket,
  data: AcknowledgeRolePayload,
) {
  const room = rooms.get(data.code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  const player = room.players.find((p) => p.socketId === socket.id);

  if (!player) {
    socket.emit("error-message", "No estás en esta sala");
    return;
  }

  const game = getGame(data.code);

  if (!game) {
    socket.emit("error-message", "Juego no encontrado");
    return;
  }

  const snapshot = game.getSnapshot();

  if (snapshot.value !== "roleAssignment") {
    socket.emit("error-message", "No es momento de confirmar tu rol");
    return;
  }

  game.send({
    type: "ROLE_ACKNOWLEDGED",
    socketId: socket.id,
  });

  emitGameState(io, data.code, game);
}

export function handleSelectChancellor(
  io: AppServer,
  socket: AppSocket,
  data: SelectChancellorPayload,
) {
  const room = rooms.get(data.code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  const game = getGame(data.code);

  if (!game) {
    socket.emit("error-message", "Juego no encontrado");
    return;
  }

  const snapshot = game.getSnapshot();
  const context = snapshot.context;

  if (snapshot.value !== "chancellorSelection") {
    socket.emit("error-message", "No es momento de elegir canciller");
    return;
  }

  if (context.presidentSocketId !== socket.id) {
    socket.emit("error-message", "Solo el presidente puede elegir canciller");
    return;
  }

  if (data.chancellorSocketId === context.presidentSocketId) {
    socket.emit("error-message", "El presidente no puede ser canciller");
    return;
  }

  const candidate = room.players.find(
    (player) => player.socketId === data.chancellorSocketId,
  );

  if (!candidate) {
    socket.emit("error-message", "Jugador no encontrado");
    return;
  }

  game.send({
    type: "CHANCELLOR_SELECTED",
    chancellorSocketId: data.chancellorSocketId,
  });

  emitGameState(io, data.code, game);
}

function emitGameUpdates(
  io: AppServer,
  code: string,
  room: NonNullable<ReturnType<typeof rooms.get>>,
  game: NonNullable<ReturnType<typeof getGame>>,
) {
  emitPrivateGameViews(io, room, game);
  emitGameState(io, code, game);
}

export function handleCastVote(
  io: AppServer,
  socket: AppSocket,
  data: CastVotePayload,
) {
  const room = rooms.get(data.code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  const player = room.players.find((p) => p.socketId === socket.id);

  if (!player) {
    socket.emit("error-message", "No estás en esta sala");
    return;
  }

  const game = getGame(data.code);

  if (!game) {
    socket.emit("error-message", "Juego no encontrado");
    return;
  }

  const snapshot = game.getSnapshot();
  const context = snapshot.context;

  if (snapshot.value !== "voting") {
    socket.emit("error-message", "No es momento de votar");
    return;
  }

  if (context.deadPlayerSocketIds.includes(socket.id)) {
    socket.emit("error-message", "Los jugadores eliminados no pueden votar");
    return;
  }

  if (context.votes.some((vote: Vote) => vote.socketId === socket.id)) {
    socket.emit("error-message", "Ya has votado en esta elección");
    return;
  }

  game.send({
    type: "CAST_VOTE",
    socketId: socket.id,
    vote: data.vote,
  });

  emitGameUpdates(io, data.code, room, game);
}

export function handlePresidentDiscard(
  io: AppServer,
  socket: AppSocket,
  data: PresidentDiscardPayload,
) {
  const room = rooms.get(data.code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  const game = getGame(data.code);

  if (!game) {
    socket.emit("error-message", "Juego no encontrado");
    return;
  }

  const snapshot = game.getSnapshot();
  const context = snapshot.context;

  if (snapshot.value !== "presidentLegislative") {
    socket.emit("error-message", "No es momento de descartar una carta");
    return;
  }

  if (context.presidentSocketId !== socket.id) {
    socket.emit("error-message", "Solo el presidente puede descartar una carta");
    return;
  }

  if (!context.presidentDraw.includes(data.policy)) {
    socket.emit("error-message", "Carta no válida");
    return;
  }

  game.send({
    type: "PRESIDENT_DISCARD",
    policy: data.policy,
  });

  emitGameUpdates(io, data.code, room, game);
}

export function handleChancellorEnact(
  io: AppServer,
  socket: AppSocket,
  data: ChancellorEnactPayload,
) {
  const room = rooms.get(data.code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  const game = getGame(data.code);

  if (!game) {
    socket.emit("error-message", "Juego no encontrado");
    return;
  }

  const snapshot = game.getSnapshot();
  const context = snapshot.context;

  if (snapshot.value !== "chancellorEnact") {
    socket.emit("error-message", "No es momento de promulgar una carta");
    return;
  }

  if (context.chancellorSocketId !== socket.id) {
    socket.emit("error-message", "Solo el canciller puede promulgar una carta");
    return;
  }

  if (context.vetoRequested) {
    socket.emit("error-message", "Hay un veto pendiente de confirmación");
    return;
  }

  if (!context.chancellorDraw.includes(data.policy)) {
    socket.emit("error-message", "Carta no válida");
    return;
  }

  game.send({
    type: "CHANCELLOR_ENACT",
    policy: data.policy,
  });

  emitGameUpdates(io, data.code, room, game);
}

export function handleRequestVeto(
  io: AppServer,
  socket: AppSocket,
  data: RequestVetoPayload,
) {
  const room = rooms.get(data.code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  const game = getGame(data.code);

  if (!game) {
    socket.emit("error-message", "Juego no encontrado");
    return;
  }

  const snapshot = game.getSnapshot();
  const context = snapshot.context;

  if (snapshot.value !== "chancellorEnact") {
    socket.emit("error-message", "No es momento de solicitar veto");
    return;
  }

  if (context.chancellorSocketId !== socket.id) {
    socket.emit("error-message", "Solo el canciller puede solicitar veto");
    return;
  }

  if (!isVetoUnlocked(context.fascistPolicies)) {
    socket.emit("error-message", "El veto aún no está desbloqueado");
    return;
  }

  if (context.vetoRequested) {
    socket.emit("error-message", "Ya se solicitó un veto");
    return;
  }

  game.send({
    type: "REQUEST_VETO",
  });

  emitGameState(io, data.code, game);
}

export function handleConfirmVeto(
  io: AppServer,
  socket: AppSocket,
  data: ConfirmVetoPayload,
) {
  const room = rooms.get(data.code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  const game = getGame(data.code);

  if (!game) {
    socket.emit("error-message", "Juego no encontrado");
    return;
  }

  const snapshot = game.getSnapshot();
  const context = snapshot.context;

  if (snapshot.value !== "chancellorEnact") {
    socket.emit("error-message", "No es momento de confirmar veto");
    return;
  }

  if (context.presidentSocketId !== socket.id) {
    socket.emit("error-message", "Solo el presidente puede confirmar el veto");
    return;
  }

  if (!context.vetoRequested) {
    socket.emit("error-message", "No hay veto pendiente");
    return;
  }

  game.send({
    type: "CONFIRM_VETO",
    agree: data.agree,
  });

  emitGameUpdates(io, data.code, room, game);
}

export function handleExecutiveAction(
  io: AppServer,
  socket: AppSocket,
  data: ExecutiveActionPayload,
) {
  const room = rooms.get(data.code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  const game = getGame(data.code);

  if (!game) {
    socket.emit("error-message", "Juego no encontrado");
    return;
  }

  const snapshot = game.getSnapshot();
  const context = snapshot.context;

  if (snapshot.value !== "executiveAction") {
    socket.emit("error-message", "No es momento de usar un poder ejecutivo");
    return;
  }

  if (context.presidentSocketId !== socket.id) {
    socket.emit("error-message", "Solo el presidente puede usar poderes ejecutivos");
    return;
  }

  const power = context.pendingPower;

  if (!power) {
    socket.emit("error-message", "No hay poder ejecutivo pendiente");
    return;
  }

  if (power === "policyPeek") {
    if (context.policyPeek.length > 0) {
      socket.emit("error-message", "Debes confirmar las cartas ojeadas primero");
      return;
    }

    game.send({
      type: "EXECUTIVE_ACTION",
    });

    emitGameUpdates(io, data.code, room, game);
    return;
  }

  if (!data.targetSocketId) {
    socket.emit("error-message", "Debes seleccionar un objetivo");
    return;
  }

  const target = room.players.find(
    (player) => player.socketId === data.targetSocketId,
  );

  if (!target) {
    socket.emit("error-message", "Jugador no encontrado");
    return;
  }

  if (context.deadPlayerSocketIds.includes(data.targetSocketId)) {
    socket.emit("error-message", "No puedes seleccionar a un jugador eliminado");
    return;
  }

  if (
    power === "investigateLoyalty" &&
    context.investigatedSocketIds.includes(data.targetSocketId)
  ) {
    socket.emit("error-message", "Ese jugador ya fue investigado");
    return;
  }

  game.send({
    type: "EXECUTIVE_ACTION",
    targetSocketId: data.targetSocketId,
  });

  emitGameUpdates(io, data.code, room, game);
}

export function handleAcknowledgePeek(
  io: AppServer,
  socket: AppSocket,
  data: AcknowledgePeekPayload,
) {
  const room = rooms.get(data.code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  const game = getGame(data.code);

  if (!game) {
    socket.emit("error-message", "Juego no encontrado");
    return;
  }

  const snapshot = game.getSnapshot();
  const context = snapshot.context;

  if (snapshot.value !== "executiveAction") {
    socket.emit("error-message", "No es momento de confirmar cartas ojeadas");
    return;
  }

  if (context.presidentSocketId !== socket.id) {
    socket.emit("error-message", "Solo el presidente puede confirmar las cartas ojeadas");
    return;
  }

  if (context.policyPeek.length === 0) {
    socket.emit("error-message", "No hay cartas por confirmar");
    return;
  }

  game.send({
    type: "ACKNOWLEDGE_PEEK",
  });

  emitGameUpdates(io, data.code, room, game);
}
