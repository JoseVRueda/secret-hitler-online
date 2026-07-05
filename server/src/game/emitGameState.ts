import type { GamePhase } from "@secret-hitler/shared";
import type { Server } from "socket.io";
import type { AnyActorRef } from "xstate";
import { toPublicGameState } from "./toPublicGameState.js";

export function emitGameState(io: Server, roomCode: string, game: AnyActorRef) {
  const snapshot = game.getSnapshot();
  const phase = snapshot.value as GamePhase;

  io.to(roomCode).emit(
    "game-updated",
    toPublicGameState(phase, snapshot.context),
  );
}
