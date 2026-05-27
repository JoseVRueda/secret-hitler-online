import type { Player, PrivatePlayerView } from "@secret-hitler/shared";

export function getPrivateGameView(
  player: Player,
  players: Player[],
): PrivatePlayerView {
  const fascists = players.filter(
    (p): p is Player & { role: "fascist" | "hitler" } =>
      p.role === "fascist" || p.role === "hitler",
  );

  if (player.role === "liberal") {
    return {
      role: player.role,
      knownPlayers: [],
    };
  }

  if (player.role === "fascist") {
    return {
      role: player.role,
      knownPlayers: fascists.map((p) => ({
        socketId: p.socketId,
        nickname: p.nickname,
        role: p.role,
      })),
    };
  }

  if (player.role === "hitler") {
    return {
      role: player.role,
      knownPlayers:
        players.length <= 6
          ? fascists
              .filter((p) => p.socketId !== player.socketId)
              .map((p) => ({
                socketId: p.socketId,
                nickname: p.nickname,
                role: "fascist",
              }))
          : [],
    };
  }

  return {
    knownPlayers: [],
  };
}
