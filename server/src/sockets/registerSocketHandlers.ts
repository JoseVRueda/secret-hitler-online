import {
  handleAcknowledgePeek,
  handleAcknowledgeRole,
  handleCastVote,
  handleChancellorEnact,
  handleConfirmVeto,
  handleExecutiveAction,
  handlePresidentDiscard,
  handleRequestVeto,
  handleSelectChancellor,
  handleStartGame,
} from "../rooms/gameHandlers.js";
import {
  handleCreateRoom,
  handleJoinRoom,
  handleSelectAvatar,
} from "../rooms/roomHandlers.js";
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

  socket.on("select-avatar", (data) => {
    handleSelectAvatar(io, socket, data);
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

  socket.on("cast-vote", (data) => {
    handleCastVote(io, socket, data);
  });

  socket.on("president-discard", (data) => {
    handlePresidentDiscard(io, socket, data);
  });

  socket.on("chancellor-enact", (data) => {
    handleChancellorEnact(io, socket, data);
  });

  socket.on("request-veto", (data) => {
    handleRequestVeto(io, socket, data);
  });

  socket.on("confirm-veto", (data) => {
    handleConfirmVeto(io, socket, data);
  });

  socket.on("executive-action", (data) => {
    handleExecutiveAction(io, socket, data);
  });

  socket.on("acknowledge-peek", (data) => {
    handleAcknowledgePeek(io, socket, data);
  });
}
