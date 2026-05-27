import type { Room } from "@secret-hitler/shared";
import type { Server } from "socket.io";
import { getPrivateGameView } from "./privateGameView.js";

export function emitPrivateGameViews(io: Server, room: Room) {
  for (const player of room.players) {
    io.to(player.socketId).emit(
      "private-game-updated",
      getPrivateGameView(player, room.players),
    );
  }
}
