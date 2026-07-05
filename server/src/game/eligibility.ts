import type { GameContext } from "@secret-hitler/shared";
import { getPresidentSocketId } from "./selectPresident.js";

const TERM_LIMIT_ALIVE_THRESHOLD = 5;

export function getAlivePlayerSocketIds(
  playerSocketIds: string[],
  deadPlayerSocketIds: string[],
): string[] {
  const deadSet = new Set(deadPlayerSocketIds);

  return playerSocketIds.filter((socketId) => !deadSet.has(socketId));
}

export function isChancellorEligible(
  candidateSocketId: string,
  context: Pick<
    GameContext,
    | "playerSocketIds"
    | "deadPlayerSocketIds"
    | "lastPresidentSocketId"
    | "lastChancellorSocketId"
  >,
): boolean {
  if (context.deadPlayerSocketIds.includes(candidateSocketId)) {
    return false;
  }

  const aliveCount = getAlivePlayerSocketIds(
    context.playerSocketIds,
    context.deadPlayerSocketIds,
  ).length;

  if (aliveCount <= TERM_LIMIT_ALIVE_THRESHOLD) {
    return candidateSocketId !== context.lastChancellorSocketId;
  }

  if (candidateSocketId === context.lastPresidentSocketId) {
    return false;
  }

  if (candidateSocketId === context.lastChancellorSocketId) {
    return false;
  }

  return true;
}

export function getEligibleChancellorSocketIds(
  context: Pick<
    GameContext,
    | "playerSocketIds"
    | "deadPlayerSocketIds"
    | "lastPresidentSocketId"
    | "lastChancellorSocketId"
    | "presidentSocketId"
  >,
): string[] {
  return getAlivePlayerSocketIds(
    context.playerSocketIds,
    context.deadPlayerSocketIds,
  ).filter(
    (socketId) =>
      socketId !== context.presidentSocketId &&
      isChancellorEligible(socketId, context),
  );
}

function findNextAlivePresidentIndex(
  playerSocketIds: string[],
  deadPlayerSocketIds: string[],
  currentIndex: number,
): number {
  const deadSet = new Set(deadPlayerSocketIds);
  const playerCount = playerSocketIds.length;

  for (let offset = 1; offset <= playerCount; offset += 1) {
    const index = (currentIndex + offset) % playerCount;
    const socketId = playerSocketIds[index];

    if (socketId && !deadSet.has(socketId)) {
      return index;
    }
  }

  return currentIndex;
}

export function advancePresidentIndex(
  playerSocketIds: string[],
  deadPlayerSocketIds: string[],
  presidentIndex: number,
  specialElectionReturnIndex: number | null,
): { presidentIndex: number; specialElectionReturnIndex: number | null } {
  if (specialElectionReturnIndex !== null) {
    return {
      presidentIndex: specialElectionReturnIndex,
      specialElectionReturnIndex: null,
    };
  }

  return {
    presidentIndex: findNextAlivePresidentIndex(
      playerSocketIds,
      deadPlayerSocketIds,
      presidentIndex,
    ),
    specialElectionReturnIndex: null,
  };
}

export function setSpecialElectionPresident(
  playerSocketIds: string[],
  deadPlayerSocketIds: string[],
  currentPresidentIndex: number,
  newPresidentSocketId: string,
): {
  presidentIndex: number;
  presidentSocketId: string;
  specialElectionReturnIndex: number;
} {
  const newPresidentIndex = playerSocketIds.indexOf(newPresidentSocketId);
  const returnIndex = findNextAlivePresidentIndex(
    playerSocketIds,
    deadPlayerSocketIds,
    currentPresidentIndex,
  );

  return {
    presidentIndex: newPresidentIndex,
    presidentSocketId: newPresidentSocketId,
    specialElectionReturnIndex: returnIndex,
  };
}

export function getAlivePresidentSocketId(
  playerSocketIds: string[],
  deadPlayerSocketIds: string[],
  presidentIndex: number,
): string | null {
  const deadSet = new Set(deadPlayerSocketIds);
  const playerCount = playerSocketIds.length;

  for (let offset = 0; offset < playerCount; offset += 1) {
    const index = (presidentIndex + offset) % playerCount;
    const socketId = playerSocketIds[index];

    if (socketId && !deadSet.has(socketId)) {
      return socketId;
    }
  }

  return getPresidentSocketId(playerSocketIds, presidentIndex);
}
