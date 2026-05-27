import {
  handleCreateRoom,
  handleJoinRoom,
  handleSelectChancellor,
  handleStartGame,
} from "@/rooms/roomHandlers.js";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@secret-hitler/shared";
import { Server, Socket } from "socket.io";

export function registerSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) {
  socket.on("create-room", (nickname) => {
    handleCreateRoom(io, socket, nickname);
  });

  socket.on("join-room", (data) => {
    handleJoinRoom(io, socket, data);
  });

  socket.on("start-game", (code: string) => {
    handleStartGame(io, socket, code);
  });

  socket.on("select-chancellor", (data) => {
    handleSelectChancellor(io, socket, data);
  });
}
