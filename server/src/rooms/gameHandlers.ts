import { emitGameState } from "@/game/emitGameState.js";
import { emitPrivateGameViews } from "@/game/emitPrivateGameViews.js";
import { getGame } from "@/game/gameService.js";
import { assignRoles } from "@/game/assignRoles.js";
import type {
  AcknowledgeRolePayload,
  ClientToServerEvents,
  SelectChancellorPayload,
  ServerToClientEvents,
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
  });

  emitRoomUpdated(io, room);
  emitPrivateGameViews(io, room);
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
