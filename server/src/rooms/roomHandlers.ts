import { assignRoles } from "@/game/assignRoles.js";
import { createGame, getGame } from "@/game/gameService.js";
import { getPrivateGameView } from "@/game/privateGameView.js";
import { generateRoomCode } from "@/utils/generateRoomCode.js";
import type {
  ClientToServerEvents,
  JoinRoomPayload,
  Room,
  ServerToClientEvents,
} from "@secret-hitler/shared";
import { Server, Socket } from "socket.io";
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

  io.to(code).emit("room-updated", room);
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

  io.to(data.code).emit("room-updated", room);
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
  game.send({ type: "ROLES_ASSIGNED" });

  io.to(code).emit("room-updated", {
    ...room,
    players: room.players.map((p) => ({
      id: p.socketId,
      nickname: p.nickname,
      isHost: p.isHost,
    })),
  });

  for (const player of room.players) {
    io.to(player.socketId).emit("private-game-updated", {
      player: getPrivateGameView(player, room.players),
    });
  }

  io.to(code).emit("game-updated", {
    phase: game.getSnapshot().value,
    context: game.getSnapshot().context,
  });
}
