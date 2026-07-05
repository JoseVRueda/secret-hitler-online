import type { GamePhase, Room } from "@secret-hitler/shared";
import type { Server } from "socket.io";
import type { AnyActorRef } from "xstate";
import { getPrivateGameView } from "./privateGameView.js";

export function emitPrivateGameViews(
  io: Server,
  room: Room,
  game: AnyActorRef,
) {
  const snapshot = game.getSnapshot();
  const phase = snapshot.value as GamePhase;
  const context = snapshot.context;

  for (const player of room.players) {
    io.to(player.socketId).emit(
      "private-game-updated",
      getPrivateGameView(player, room.players, phase, context),
    );
  }
}
