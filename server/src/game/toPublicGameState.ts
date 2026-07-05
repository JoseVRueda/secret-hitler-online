import type {
  GameContext,
  GamePhase,
  PublicGameState,
  PublicPlayerRole,
} from "@secret-hitler/shared";
import { isVetoUnlocked } from "./board.js";

export function toPublicGameState(
  phase: GamePhase,
  context: GameContext,
): PublicGameState {
  const hasVotedSocketIds =
    phase === "voting" ? context.votes.map((vote) => vote.socketId) : [];

  const roles: PublicPlayerRole[] | null =
    phase === "gameOver"
      ? context.playerSocketIds.map((socketId) => ({
          socketId,
          role: context.playerRoles[socketId] ?? "liberal",
        }))
      : null;

  return {
    phase,
    roomCode: context.roomCode,
    round: context.round,
    presidentSocketId: context.presidentSocketId,
    chancellorSocketId: context.chancellorSocketId,
    presidentIndex: context.presidentIndex,
    playerSocketIds: context.playerSocketIds,
    rolesAcknowledgedBy: context.rolesAcknowledgedBy,
    liberalPolicies: context.liberalPolicies,
    fascistPolicies: context.fascistPolicies,
    electionTracker: context.electionTracker,
    deckSize: context.policyDeck.length,
    discardSize: context.discardPile.length,
    lastPresidentSocketId: context.lastPresidentSocketId,
    lastChancellorSocketId: context.lastChancellorSocketId,
    deadPlayerSocketIds: context.deadPlayerSocketIds,
    investigatedSocketIds: context.investigatedSocketIds,
    hasVotedSocketIds,
    pendingPower: context.pendingPower,
    vetoRequested: context.vetoRequested,
    vetoUnlocked: isVetoUnlocked(context.fascistPolicies),
    lastElection: context.lastElection,
    winInfo: context.winInfo,
    roles,
  };
}
