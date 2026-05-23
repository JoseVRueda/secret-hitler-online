import { generateRoomCode } from "@/utils/generateRoomCode.js";
import { Server, Socket } from "socket.io";
import { rooms } from "./roomStore.js";
import type { Room } from "@secret-hitler/shared";

export function handleCreateRoom(io: Server, socket: Socket, nickname: string) {
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

  socket.join(code);

  io.to(code).emit("room-updated", room);
}

export function handleJoinRoom(
  io: Server,
  socket: Socket,
  data: {
    code: string;
    nickname: string;
  },
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
