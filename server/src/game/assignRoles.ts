import { roleDistributions } from "../data/roleDistributions.js";
import { shuffleArray } from "../utils/shuffleArray.js";
import type { Player, PlayerRole } from "@secret-hitler/shared";

function getRoleDistribution(playerCount: number): PlayerRole[] {
  if (playerCount < 5 || playerCount > 10) {
    throw new Error("Secret Hitler requiere entre 5 y 10 jugadores");
  }

  return shuffleArray(roleDistributions[playerCount] ?? []);
}

export function assignRoles(players: Player[]): Player[] {
  const roles = getRoleDistribution(players.length);

  return shuffleArray(players).map((player, index) => ({
    ...player,
    role: roles[index] as PlayerRole,
  }));
}
