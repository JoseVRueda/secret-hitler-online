import type { Player, PlayerRole } from "@secret-hitler/shared";

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function getRoleDistribution(playerCount: number): PlayerRole[] {
  if (playerCount < 5 || playerCount > 10) {
    throw new Error("Secret Hitler requiere entre 5 y 10 jugadores");
  }

  const distributions: Record<number, PlayerRole[]> = {
    5: ["hitler", "fascist", "liberal", "liberal", "liberal"],
    6: ["hitler", "fascist", "liberal", "liberal", "liberal", "liberal"],
    7: [
      "hitler",
      "fascist",
      "fascist",
      "liberal",
      "liberal",
      "liberal",
      "liberal",
    ],
    8: [
      "hitler",
      "fascist",
      "fascist",
      "liberal",
      "liberal",
      "liberal",
      "liberal",
      "liberal",
    ],
    9: [
      "hitler",
      "fascist",
      "fascist",
      "fascist",
      "liberal",
      "liberal",
      "liberal",
      "liberal",
      "liberal",
    ],
    10: [
      "hitler",
      "fascist",
      "fascist",
      "fascist",
      "liberal",
      "liberal",
      "liberal",
      "liberal",
      "liberal",
      "liberal",
    ],
  };

  return shuffle(distributions[playerCount] ?? []);
}

export function assignRoles(players: Player[]): Player[] {
  const roles = getRoleDistribution(players.length);

  return shuffle(players).map((player, index) => ({
    ...player,
    role: roles[index] ?? "liberal",
  }));
}
