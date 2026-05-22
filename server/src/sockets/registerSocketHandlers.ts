import { handleCreateRoom, handleJoinRoom } from "@/rooms/roomHandlers.js";
import { Server, Socket } from "socket.io";

export function registerSocketHandlers(io: Server, socket: Socket) {
  socket.on("create-room", (nickname: string) => {
    handleCreateRoom(io, socket, nickname);
  });

  socket.on("join-room", (data: { code: string; nickname: string }) => {
    handleJoinRoom(io, socket, data);
  });
}
