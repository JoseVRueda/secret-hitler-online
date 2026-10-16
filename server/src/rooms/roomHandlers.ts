import { createGame, getGame } from "@/game/gameService.js";
import { generateRoomCode } from "@/utils/generateRoomCode.js";
import {
  AVATAR_COUNT,
  type ClientToServerEvents,
  type JoinRoomPayload,
  type Player,
  type Room,
  type SelectAvatarPayload,
  type ServerToClientEvents,
} from "@secret-hitler/shared";
import type { Server, Socket } from "socket.io";
import { emitRoomUpdated } from "./broadcastRoom.js";
import { rooms } from "./roomStore.js";

function takeAvatar(players: Player[]): number {
  const used = new Set(players.map((player) => player.avatar));

  for (let avatar = 1; avatar <= AVATAR_COUNT; avatar += 1) {
    if (!used.has(avatar)) {
      return avatar;
    }
  }

  return 1;
}

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
        avatar: 1,
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
    avatar: takeAvatar(room.players),
  });

  socket.join(data.code);

  emitRoomUpdated(io, room);
}

export function handleSelectAvatar(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  data: SelectAvatarPayload,
) {
  const room = rooms.get(data.code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  const player = room.players.find(
    (candidate) => candidate.socketId === socket.id,
  );

  if (!player) {
    socket.emit("error-message", "No estás en esta sala");
    return;
  }

  const phase = getGame(data.code)?.getSnapshot().value;

  if (phase !== "lobby") {
    socket.emit(
      "error-message",
      "Solo puedes cambiar el retrato en la sala de espera",
    );
    return;
  }

  if (
    !Number.isInteger(data.avatar) ||
    data.avatar < 1 ||
    data.avatar > AVATAR_COUNT
  ) {
    socket.emit("error-message", "Retrato no válido");
    return;
  }

  const taken = room.players.some(
    (other) =>
      other.socketId !== player.socketId && other.avatar === data.avatar,
  );

  if (taken) {
    socket.emit("error-message", "Ese retrato ya está en uso");
    return;
  }

  player.avatar = data.avatar;
  emitRoomUpdated(io, room);
}
