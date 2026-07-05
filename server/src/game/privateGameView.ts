import type {
  GameContext,
  GamePhase,
  Player,
  PrivatePlayerView,
} from "@secret-hitler/shared";

function getRoleBasedView(
  player: Player,
  players: Player[],
): Pick<PrivatePlayerView, "role" | "knownPlayers"> {
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
                role: "fascist" as const,
              }))
          : [],
    };
  }

  return {
    knownPlayers: [],
  };
}

export function getPrivateGameView(
  player: Player,
  players: Player[],
  phase: GamePhase,
  context: GameContext,
): PrivatePlayerView {
  const view: PrivatePlayerView = getRoleBasedView(player, players);

  if (player.socketId === context.presidentSocketId) {
    if (phase === "presidentLegislative" && context.presidentDraw.length > 0) {
      view.policiesToAct = context.presidentDraw;
    }

    if (context.policyPeek.length > 0) {
      view.policyPeek = context.policyPeek;
    }
  }

  if (
    player.socketId === context.chancellorSocketId &&
    phase === "chancellorEnact" &&
    context.chancellorDraw.length > 0
  ) {
    view.policiesToAct = context.chancellorDraw;
  }

  const investigation = context.investigationResults[player.socketId];

  if (investigation) {
    const target = players.find(
      (p) => p.socketId === investigation.targetSocketId,
    );

    if (target) {
      view.investigationResult = {
        nickname: target.nickname,
        party: investigation.party,
      };
    }
  }

  return view;
}
