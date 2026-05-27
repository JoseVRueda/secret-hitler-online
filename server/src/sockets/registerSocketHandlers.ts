import {
  handleAcknowledgeRole,
  handleSelectChancellor,
  handleStartGame,
} from "@/rooms/gameHandlers.js";
import { handleCreateRoom, handleJoinRoom } from "@/rooms/roomHandlers.js";
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

  socket.on("start-game", (code) => {
    handleStartGame(io, socket, code);
  });

  socket.on("acknowledge-role", (data) => {
    handleAcknowledgeRole(io, socket, data);
  });

  socket.on("select-chancellor", (data) => {
    handleSelectChancellor(io, socket, data);
  });
}
