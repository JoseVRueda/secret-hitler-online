import { socket } from "@/lib/socket";
import { useGameStore } from "@/store/useGameStore";
import type { GameState, PrivatePlayerView } from "@secret-hitler/shared";

export function registerGameSocketEvents() {
  const onGameUpdated = (game: GameState) => {
    useGameStore.getState().setGame(game);
  };

  const onPrivateGameUpdated = (player: PrivatePlayerView) => {
    useGameStore.getState().setPrivatePlayer(player);
  };

  socket.on("game-updated", onGameUpdated);
  socket.on("private-game-updated", onPrivateGameUpdated);

  return () => {
    socket.off("game-updated", onGameUpdated);
    socket.off("private-game-updated", onPrivateGameUpdated);
  };
}
