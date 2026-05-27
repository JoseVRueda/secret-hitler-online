import type { Server } from "socket.io";
import type { AnyActorRef } from "xstate";

export function emitGameState(io: Server, roomCode: string, game: AnyActorRef) {
  const snapshot = game.getSnapshot();

  io.to(roomCode).emit("game-updated", {
    phase: snapshot.value,
    context: snapshot.context,
  });
}
