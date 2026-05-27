import { assignRoles } from "@/game/assignRoles.js";
import { emitGameState } from "@/game/emitGameState.js";
import { emitPrivateGameViews } from "@/game/emitPrivateGameViews.js";
import { createGame, getGame } from "@/game/gameService.js";
import { getPresidentSocketId } from "@/game/selectPresident.js";
import { generateRoomCode } from "@/utils/generateRoomCode.js";
import type {
  ClientToServerEvents,
  JoinRoomPayload,
  Room,
  ServerToClientEvents,
} from "@secret-hitler/shared";
import { Server, Socket } from "socket.io";
import { emitRoomUpdated } from "./broadcastRoom.js";
import { rooms } from "./roomStore.js";

export function handleCreateRoom(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  nickname: string,
) {
  const code = generateRoomCode();

  const room: Room = {
    code,
    players: [
      {
        socketId: socket.id,
        nickname,
        isHost: true,
      },
    ],
  };

  rooms.set(code, room);

  createGame(code);

  socket.join(code);

  emitRoomUpdated(io, room);
}

export function handleJoinRoom(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  data: JoinRoomPayload,
) {
  const room = rooms.get(data.code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  room.players.push({
    socketId: socket.id,
    nickname: data.nickname,
    isHost: false,
  });

  socket.join(data.code);

  emitRoomUpdated(io, room);
}

export function handleStartGame(io: Server, socket: Socket, code: string) {
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

  game.send({ type: "START_GAME" });

  emitRoomUpdated(io, room);
  emitPrivateGameViews(io, room);
  emitGameState(io, code, game);
}

function allRolesAcknowledged(
  room: Room,
  rolesAcknowledgedBy: string[],
): boolean {
  return room.players.every((player) =>
    rolesAcknowledgedBy.includes(player.socketId),
  );
}

export function handleAcknowledgeRole(
  io: Server,
  socket: Socket,
  code: string,
) {
  const room = rooms.get(code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  const player = room.players.find((p) => p.socketId === socket.id);

  if (!player) {
    socket.emit("error-message", "No estás en esta sala");
    return;
  }

  const game = getGame(code);

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

  const updatedSnapshot = game.getSnapshot();

  emitGameState(io, code, game);

  if (
    !allRolesAcknowledged(room, updatedSnapshot.context.rolesAcknowledgedBy)
  ) {
    return;
  }

  const presidentSocketId = getPresidentSocketId(
    room,
    updatedSnapshot.context.presidentIndex,
  );

  game.send({
    type: "PRESIDENT_SELECTED",
    presidentSocketId,
  });

  emitGameState(io, code, game);
}

export function handleSelectChancellor(
  io: Server,
  socket: Socket,
  data: {
    code: string;
    chancellorSocketId: string;
  },
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
