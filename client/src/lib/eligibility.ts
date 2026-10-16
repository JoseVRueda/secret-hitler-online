import type { PublicGameState } from "@secret-hitler/shared";

const TERM_LIMIT_ALIVE_THRESHOLD = 5;

export function getEligibleChancellorIds(game: PublicGameState): string[] {
  const dead = new Set(game.deadPlayerSocketIds);
  const alive = game.playerSocketIds.filter((id) => !dead.has(id));

  return alive.filter((id) => {
    if (id === game.presidentSocketId) {
      return false;
    }

    if (alive.length <= TERM_LIMIT_ALIVE_THRESHOLD) {
      return id !== game.lastChancellorSocketId;
    }

    return (
      id !== game.lastPresidentSocketId && id !== game.lastChancellorSocketId
    );
  });
}
