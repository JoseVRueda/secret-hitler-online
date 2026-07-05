import type {
  GameContext,
  PlayerRole,
  Policy,
  Vote,
  VoteValue,
} from "@secret-hitler/shared";
import { assign, createMachine } from "xstate";
import {
  advancePresidentIndex,
  getAlivePlayerSocketIds,
  getAlivePresidentSocketId,
  isChancellorEligible,
} from "./eligibility.js";
import { getExecutivePower } from "./board.js";
import { createPolicyDeck, drawPolicies } from "./policyDeck.js";
import { tallyVotes } from "./voting.js";
import { checkWinConditions } from "./winConditions.js";

type GameEvent =
  | {
      type: "START_GAME";
      playerSocketIds: string[];
      playerRoles: Record<string, PlayerRole>;
    }
  | { type: "ROLE_ACKNOWLEDGED"; socketId: string }
  | { type: "CHANCELLOR_SELECTED"; chancellorSocketId: string }
  | { type: "CAST_VOTE"; socketId: string; vote: VoteValue }
  | { type: "PRESIDENT_DISCARD"; policy: Policy }
  | { type: "CHANCELLOR_ENACT"; policy: Policy }
  | { type: "REQUEST_VETO" }
  | { type: "CONFIRM_VETO"; agree: boolean }
  | { type: "EXECUTIVE_ACTION"; targetSocketId?: string }
  | { type: "ACKNOWLEDGE_PEEK" };

function appendRoleAcknowledgement(
  rolesAcknowledgedBy: string[],
  socketId: string,
): string[] {
  if (rolesAcknowledgedBy.includes(socketId)) {
    return rolesAcknowledgedBy;
  }

  return [...rolesAcknowledgedBy, socketId];
}

function allRolesAcknowledged(context: GameContext, socketId: string): boolean {
  const nextAcknowledgements = appendRoleAcknowledgement(
    context.rolesAcknowledgedBy,
    socketId,
  );

  return nextAcknowledgements.length === context.playerSocketIds.length;
}

function getAliveSocketIds(context: GameContext): string[] {
  return getAlivePlayerSocketIds(
    context.playerSocketIds,
    context.deadPlayerSocketIds,
  );
}

function allAliveHaveVoted(context: GameContext): boolean {
  const aliveSocketIds = getAliveSocketIds(context);
  const votedSocketIds = new Set(context.votes.map((vote) => vote.socketId));

  return (
    aliveSocketIds.length > 0 &&
    aliveSocketIds.every((socketId) => votedSocketIds.has(socketId))
  );
}

function appendVote(
  votes: Vote[],
  socketId: string,
  vote: VoteValue,
): Vote[] {
  return [...votes.filter((entry) => entry.socketId !== socketId), { socketId, vote }];
}

function buildLastElection(
  context: GameContext,
  passed: boolean,
): GameContext["lastElection"] {
  if (!context.presidentSocketId || !context.chancellorSocketId) {
    return null;
  }

  return {
    presidentSocketId: context.presidentSocketId,
    chancellorSocketId: context.chancellorSocketId,
    votes: context.votes,
    passed,
  };
}

function getPartyFromRole(role: PlayerRole): "liberal" | "fascist" {
  return role === "liberal" ? "liberal" : "fascist";
}

function applyEnactedPolicy(
  context: GameContext,
  policy: Policy,
  deck: Policy[],
  discard: Policy[],
): Pick<
  GameContext,
  | "policyDeck"
  | "discardPile"
  | "liberalPolicies"
  | "fascistPolicies"
  | "winInfo"
  | "pendingPower"
> {
  const discardPile = [...discard, policy];
  const liberalPolicies =
    context.liberalPolicies + (policy === "liberal" ? 1 : 0);
  const fascistPolicies =
    context.fascistPolicies + (policy === "fascist" ? 1 : 0);
  const winInfo = checkWinConditions({ liberalPolicies, fascistPolicies });
  const pendingPower =
    winInfo || policy !== "fascist"
      ? null
      : getExecutivePower(context.playerSocketIds.length, fascistPolicies);

  return {
    policyDeck: deck,
    discardPile,
    liberalPolicies,
    fascistPolicies,
    winInfo,
    pendingPower,
  };
}

function advanceGovernment(context: GameContext): Partial<GameContext> {
  const { presidentIndex, specialElectionReturnIndex } = advancePresidentIndex(
    context.playerSocketIds,
    context.deadPlayerSocketIds,
    context.presidentIndex,
    context.specialElectionReturnIndex,
  );

  return {
    round: context.round + 1,
    presidentIndex,
    specialElectionReturnIndex,
    presidentSocketId: getAlivePresidentSocketId(
      context.playerSocketIds,
      context.deadPlayerSocketIds,
      presidentIndex,
    ),
    chancellorSocketId: null,
    votes: [],
    vetoRequested: false,
    presidentDraw: [],
    chancellorDraw: [],
  };
}

function resetTermLimits(): Pick<
  GameContext,
  "lastPresidentSocketId" | "lastChancellorSocketId"
> {
  return {
    lastPresidentSocketId: null,
    lastChancellorSocketId: null,
  };
}

function handleVotePassed(context: GameContext): Partial<GameContext> {
  const draw = drawPolicies(context.policyDeck, context.discardPile, 3);

  return {
    policyDeck: draw.deck,
    discardPile: draw.discard,
    presidentDraw: draw.drawn,
    chancellorDraw: [],
    lastElection: buildLastElection(context, true),
  };
}

function handleHitlerElectedWin(context: GameContext): Partial<GameContext> {
  return {
    winInfo: { winner: "fascist", reason: "hitlerElected" },
    lastElection: buildLastElection(context, true),
  };
}

function isHitlerElected(context: GameContext): boolean {
  if (!context.chancellorSocketId) {
    return false;
  }

  const chancellorRole = context.playerRoles[context.chancellorSocketId];

  return (
    chancellorRole === "hitler" &&
    context.fascistPolicies >= 3 &&
    checkWinConditions({
      liberalPolicies: context.liberalPolicies,
      fascistPolicies: context.fascistPolicies,
      chancellorRole,
    }) !== null
  );
}

function handleVoteFailedWithoutChaos(
  context: GameContext,
  electionTracker: number,
  lastElection: GameContext["lastElection"],
): Partial<GameContext> {
  return {
    ...advanceGovernment(context),
    electionTracker,
    lastElection,
  };
}

function handleChaosEnactment(context: GameContext): Partial<GameContext> {
  const draw = drawPolicies(context.policyDeck, context.discardPile, 1);
  const policy = draw.drawn[0];

  if (!policy) {
    throw new Error("No quedan cartas en el mazo para el caos electoral");
  }

  const enactUpdates = applyEnactedPolicy(
    context,
    policy,
    draw.deck,
    draw.discard,
  );
  const nextContext = {
    ...context,
    ...enactUpdates,
    electionTracker: 0,
    ...resetTermLimits(),
    chancellorSocketId: null,
    votes: [],
  };

  if (enactUpdates.winInfo || enactUpdates.pendingPower) {
    return {
      ...enactUpdates,
      electionTracker: 0,
      ...resetTermLimits(),
      chancellorSocketId: null,
      votes: [],
      lastElection: context.lastElection ?? buildLastElection(context, false),
    };
  }

  return {
    ...enactUpdates,
    ...advanceGovernment(nextContext),
    electionTracker: 0,
    ...resetTermLimits(),
    lastElection: context.lastElection ?? buildLastElection(context, false),
  };
}

function handleVoteFailed(context: GameContext): Partial<GameContext> {
  const electionTracker = context.electionTracker + 1;
  const lastElection = buildLastElection(context, false);

  if (electionTracker < 3) {
    return handleVoteFailedWithoutChaos(context, electionTracker, lastElection);
  }

  return handleChaosEnactment({
    ...context,
    electionTracker,
    lastElection,
  });
}

function willTriggerChaos(context: GameContext): boolean {
  return context.electionTracker + 1 >= 3;
}

function previewChaosEnactment(context: GameContext) {
  const draw = drawPolicies(context.policyDeck, context.discardPile, 1);
  const policy = draw.drawn[0];

  if (!policy) {
    return null;
  }

  return applyEnactedPolicy(context, policy, draw.deck, draw.discard);
}

function chaosResultsInExecutivePower(context: GameContext): boolean {
  if (!willTriggerChaos(context)) {
    return false;
  }

  const enactUpdates = previewChaosEnactment(context);

  return (
    enactUpdates !== null &&
    enactUpdates.pendingPower !== null &&
    enactUpdates.winInfo === null
  );
}

function chaosResultsInGameOver(context: GameContext): boolean {
  if (!willTriggerChaos(context)) {
    return false;
  }

  const enactUpdates = previewChaosEnactment(context);

  return enactUpdates !== null && enactUpdates.winInfo !== null;
}

function handlePresidentDiscard(
  context: GameContext,
  discardedPolicy: Policy,
): Partial<GameContext> {
  const discardIndex = context.presidentDraw.indexOf(discardedPolicy);

  if (discardIndex === -1) {
    return {};
  }

  const remainingPolicies = context.presidentDraw.filter(
    (_, index) => index !== discardIndex,
  );

  if (remainingPolicies.length !== 2) {
    return {};
  }

  return {
    discardPile: [...context.discardPile, discardedPolicy],
    presidentDraw: [],
    chancellorDraw: remainingPolicies,
  };
}

function handleChancellorEnact(
  context: GameContext,
  enactedPolicy: Policy,
): Partial<GameContext> {
  const enactIndex = context.chancellorDraw.indexOf(enactedPolicy);

  if (enactIndex === -1) {
    return {};
  }

  const discardedPolicy = context.chancellorDraw.find(
    (_, index) => index !== enactIndex,
  );
  const discardPile = discardedPolicy
    ? [...context.discardPile, discardedPolicy]
    : [...context.discardPile];

  const enactUpdates = applyEnactedPolicy(
    context,
    enactedPolicy,
    context.policyDeck,
    discardPile,
  );

  return {
    ...enactUpdates,
    chancellorDraw: [],
    presidentDraw: [],
    electionTracker: 0,
    lastPresidentSocketId: context.presidentSocketId,
    lastChancellorSocketId: context.chancellorSocketId,
  };
}

function applyChancellorEnactAndAdvance(
  context: GameContext,
  enactedPolicy: Policy,
): Partial<GameContext> {
  const updates = handleChancellorEnact(context, enactedPolicy);

  return {
    ...updates,
    ...advanceGovernment({ ...context, ...updates }),
  };
}

function handleConfirmedVeto(context: GameContext): Partial<GameContext> {
  const discardPile = [...context.discardPile, ...context.chancellorDraw];
  const electionTracker = context.electionTracker + 1;

  if (electionTracker < 3) {
    return {
      discardPile,
      chancellorDraw: [],
      presidentDraw: [],
      electionTracker,
      vetoRequested: false,
      chancellorSocketId: null,
      votes: [],
    };
  }

  return handleChaosEnactment({
    ...context,
    discardPile,
    chancellorDraw: [],
    presidentDraw: [],
    electionTracker,
    vetoRequested: false,
  });
}

function resolveExecutiveAction(
  context: GameContext,
  targetSocketId?: string,
): Partial<GameContext> {
  const power = context.pendingPower;

  if (!power) {
    return {};
  }

  if (power === "investigateLoyalty") {
    if (!targetSocketId || !context.presidentSocketId) {
      return {};
    }

    const targetRole = context.playerRoles[targetSocketId];

    if (!targetRole) {
      return {};
    }

    return {
      investigatedSocketIds: context.investigatedSocketIds.includes(targetSocketId)
        ? context.investigatedSocketIds
        : [...context.investigatedSocketIds, targetSocketId],
      investigationResults: {
        ...context.investigationResults,
        [context.presidentSocketId]: {
          targetSocketId,
          party: getPartyFromRole(targetRole),
        },
      },
      pendingPower: null,
    };
  }

  if (power === "specialElection") {
    if (!targetSocketId) {
      return {};
    }

    const newPresidentIndex = context.playerSocketIds.indexOf(targetSocketId);
    const returnIndex = advancePresidentIndex(
      context.playerSocketIds,
      context.deadPlayerSocketIds,
      context.presidentIndex,
      context.specialElectionReturnIndex,
    ).presidentIndex;

    return {
      presidentIndex: newPresidentIndex,
      presidentSocketId: targetSocketId,
      specialElectionReturnIndex: returnIndex,
      pendingPower: null,
      chancellorSocketId: null,
      votes: [],
    };
  }

  if (power === "policyPeek") {
    const draw = drawPolicies(context.policyDeck, context.discardPile, 3);

    return {
      policyDeck: draw.deck,
      discardPile: draw.discard,
      policyPeek: draw.drawn,
      pendingPower: null,
    };
  }

  if (power === "execution") {
    if (!targetSocketId) {
      return {};
    }

    const executedRole = context.playerRoles[targetSocketId];
    const winInfo = executedRole
      ? checkWinConditions({
          liberalPolicies: context.liberalPolicies,
          fascistPolicies: context.fascistPolicies,
          executedPlayerRole: executedRole,
        })
      : null;

    return {
      deadPlayerSocketIds: context.deadPlayerSocketIds.includes(targetSocketId)
        ? context.deadPlayerSocketIds
        : [...context.deadPlayerSocketIds, targetSocketId],
      pendingPower: null,
      winInfo,
    };
  }

  return {};
}

function applyExecutiveActionAndAdvance(
  context: GameContext,
  targetSocketId?: string,
): Partial<GameContext> {
  const updates = resolveExecutiveAction(context, targetSocketId);

  return {
    ...updates,
    ...advanceGovernment({ ...context, ...updates }),
  };
}

function shouldAdvanceAfterExecutiveAction(context: GameContext): boolean {
  return context.pendingPower !== "policyPeek";
}

function createInitialContext(roomCode: string): GameContext {
  return {
    roomCode,
    round: 1,
    presidentSocketId: null,
    chancellorSocketId: null,
    presidentIndex: 0,
    playerSocketIds: [],
    rolesAcknowledgedBy: [],
    votes: [],
    policyDeck: [],
    discardPile: [],
    liberalPolicies: 0,
    fascistPolicies: 0,
    electionTracker: 0,
    presidentDraw: [],
    chancellorDraw: [],
    lastPresidentSocketId: null,
    lastChancellorSocketId: null,
    deadPlayerSocketIds: [],
    investigatedSocketIds: [],
    pendingPower: null,
    specialElectionReturnIndex: null,
    vetoRequested: false,
    winInfo: null,
    lastElection: null,
    playerRoles: {},
    policyPeek: [],
    investigationResults: {},
  };
}

export const createGameMachine = (roomCode: string) =>
  createMachine({
    id: "secret-hitler-game",

    types: {} as {
      context: GameContext;
      events: GameEvent;
    },

    context: createInitialContext(roomCode),

    initial: "lobby",

    states: {
      lobby: {
        on: {
          START_GAME: {
            target: "roleAssignment",
            actions: assign(({ event }) => ({
              round: 1,
              presidentSocketId: null,
              chancellorSocketId: null,
              presidentIndex: 0,
              playerSocketIds: event.playerSocketIds,
              rolesAcknowledgedBy: [],
              votes: [],
              policyDeck: createPolicyDeck(),
              discardPile: [],
              liberalPolicies: 0,
              fascistPolicies: 0,
              electionTracker: 0,
              presidentDraw: [],
              chancellorDraw: [],
              lastPresidentSocketId: null,
              lastChancellorSocketId: null,
              deadPlayerSocketIds: [],
              investigatedSocketIds: [],
              pendingPower: null,
              specialElectionReturnIndex: null,
              vetoRequested: false,
              winInfo: null,
              lastElection: null,
              playerRoles: event.playerRoles,
              policyPeek: [],
              investigationResults: {},
            })),
          },
        },
      },

      roleAssignment: {
        on: {
          ROLE_ACKNOWLEDGED: [
            {
              guard: ({ context, event }) =>
                allRolesAcknowledged(context, event.socketId),
              target: "chancellorSelection",
              actions: assign({
                rolesAcknowledgedBy: ({ context, event }) =>
                  appendRoleAcknowledgement(
                    context.rolesAcknowledgedBy,
                    event.socketId,
                  ),
                presidentSocketId: ({ context }) =>
                  getAlivePresidentSocketId(
                    context.playerSocketIds,
                    context.deadPlayerSocketIds,
                    context.presidentIndex,
                  ),
              }),
            },
            {
              actions: assign({
                rolesAcknowledgedBy: ({ context, event }) =>
                  appendRoleAcknowledgement(
                    context.rolesAcknowledgedBy,
                    event.socketId,
                  ),
              }),
            },
          ],
        },
      },

      chancellorSelection: {
        on: {
          CHANCELLOR_SELECTED: {
            guard: ({ context, event }) =>
              isChancellorEligible(event.chancellorSocketId, context),
            target: "voting",
            actions: assign({
              chancellorSocketId: ({ event }) => event.chancellorSocketId,
              votes: [],
              vetoRequested: false,
            }),
          },
        },
      },

      voting: {
        on: {
          CAST_VOTE: {
            actions: assign({
              votes: ({ context, event }) =>
                appendVote(context.votes, event.socketId, event.vote),
            }),
          },
        },
        always: [
          {
            guard: ({ context }) =>
              allAliveHaveVoted(context) &&
              tallyVotes(context.votes, getAliveSocketIds(context).length) &&
              isHitlerElected(context),
            target: "gameOver",
            actions: assign(({ context }) => handleHitlerElectedWin(context)),
          },
          {
            guard: ({ context }) =>
              allAliveHaveVoted(context) &&
              tallyVotes(context.votes, getAliveSocketIds(context).length) &&
              !isHitlerElected(context),
            target: "presidentLegislative",
            actions: assign(({ context }) => handleVotePassed(context)),
          },
          {
            guard: ({ context }) =>
              allAliveHaveVoted(context) &&
              !tallyVotes(context.votes, getAliveSocketIds(context).length) &&
              chaosResultsInGameOver(context),
            target: "gameOver",
            actions: assign(({ context }) => handleVoteFailed(context)),
          },
          {
            guard: ({ context }) =>
              allAliveHaveVoted(context) &&
              !tallyVotes(context.votes, getAliveSocketIds(context).length) &&
              chaosResultsInExecutivePower(context),
            target: "executiveAction",
            actions: assign(({ context }) => handleVoteFailed(context)),
          },
          {
            guard: ({ context }) =>
              allAliveHaveVoted(context) &&
              !tallyVotes(context.votes, getAliveSocketIds(context).length),
            target: "chancellorSelection",
            actions: assign(({ context }) => handleVoteFailed(context)),
          },
        ],
      },

      presidentLegislative: {
        on: {
          PRESIDENT_DISCARD: {
            target: "chancellorEnact",
            actions: assign(({ context, event }) =>
              handlePresidentDiscard(context, event.policy),
            ),
          },
        },
      },

      chancellorEnact: {
        on: {
          CHANCELLOR_ENACT: [
            {
              guard: ({ context, event }) =>
                handleChancellorEnact(context, event.policy).winInfo != null,
              target: "gameOver",
              actions: assign(({ context, event }) =>
                handleChancellorEnact(context, event.policy),
              ),
            },
            {
              guard: ({ context, event }) =>
                handleChancellorEnact(context, event.policy).pendingPower != null,
              target: "executiveAction",
              actions: assign(({ context, event }) =>
                handleChancellorEnact(context, event.policy),
              ),
            },
            {
              target: "chancellorSelection",
              actions: assign(({ context, event }) =>
                applyChancellorEnactAndAdvance(context, event.policy),
              ),
            },
          ],
          REQUEST_VETO: {
            actions: assign({
              vetoRequested: true,
            }),
          },
          CONFIRM_VETO: [
            {
              guard: ({ context, event }) =>
                event.agree &&
                willTriggerChaos(context) &&
                chaosResultsInGameOver(context),
              target: "gameOver",
              actions: assign(({ context }) => handleConfirmedVeto(context)),
            },
            {
              guard: ({ context, event }) =>
                event.agree &&
                willTriggerChaos(context) &&
                chaosResultsInExecutivePower(context),
              target: "executiveAction",
              actions: assign(({ context }) => handleConfirmedVeto(context)),
            },
            {
              guard: ({ event }) => event.agree,
              target: "chancellorSelection",
              actions: assign(({ context }) => handleConfirmedVeto(context)),
            },
            {
              actions: assign({
                vetoRequested: false,
              }),
            },
          ],
        },
      },

      executiveAction: {
        on: {
          EXECUTIVE_ACTION: [
            {
              guard: ({ context, event }) => {
                const updates = resolveExecutiveAction(
                  context,
                  event.targetSocketId,
                );
                return updates.winInfo !== null && updates.winInfo !== undefined;
              },
              target: "gameOver",
              actions: assign(({ context, event }) =>
                resolveExecutiveAction(context, event.targetSocketId),
              ),
            },
            {
              guard: ({ context }) => context.pendingPower === "specialElection",
              target: "chancellorSelection",
              actions: assign(({ context, event }) =>
                resolveExecutiveAction(context, event.targetSocketId),
              ),
            },
            {
              guard: ({ context, event }) => {
                const updates = resolveExecutiveAction(
                  context,
                  event.targetSocketId,
                );
                return (
                  shouldAdvanceAfterExecutiveAction(context) &&
                  updates.winInfo == null
                );
              },
              target: "chancellorSelection",
              actions: assign(({ context, event }) =>
                applyExecutiveActionAndAdvance(context, event.targetSocketId),
              ),
            },
            {
              actions: assign(({ context, event }) =>
                resolveExecutiveAction(context, event.targetSocketId),
              ),
            },
          ],
          ACKNOWLEDGE_PEEK: [
            {
              guard: ({ context }) => context.policyPeek.length > 0,
              target: "chancellorSelection",
              actions: assign(({ context }) => ({
                policyPeek: [],
                ...advanceGovernment(context),
              })),
            },
          ],
        },
      },

      gameOver: {
        type: "final",
      },
    },
  });
