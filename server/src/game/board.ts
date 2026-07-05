import type { ExecutivePower, WinInfo } from "@secret-hitler/shared";

const LIBERAL_WIN_COUNT = 5;
const FASCIST_WIN_COUNT = 6;
const VETO_UNLOCK_FASCIST_COUNT = 5;

type FascistBoardLayout = Record<number, ExecutivePower | null>;

function getFascistBoardLayout(playerCount: number): FascistBoardLayout {
  if (playerCount <= 6) {
    return {
      1: null,
      2: null,
      3: "policyPeek",
      4: "execution",
      5: "execution",
      6: null,
    };
  }

  if (playerCount <= 8) {
    return {
      1: null,
      2: "investigateLoyalty",
      3: "specialElection",
      4: "execution",
      5: "execution",
      6: null,
    };
  }

  return {
    1: "investigateLoyalty",
    2: "investigateLoyalty",
    3: "specialElection",
    4: "execution",
    5: "execution",
    6: null,
  };
}

export function getExecutivePower(
  playerCount: number,
  fascistPolicies: number,
): ExecutivePower | null {
  if (fascistPolicies < 1 || fascistPolicies > 5) {
    return null;
  }

  const layout = getFascistBoardLayout(playerCount);

  return layout[fascistPolicies] ?? null;
}

export function isVetoUnlocked(fascistPolicies: number): boolean {
  return fascistPolicies >= VETO_UNLOCK_FASCIST_COUNT;
}

export function checkPolicyCountWin(
  liberalPolicies: number,
  fascistPolicies: number,
): WinInfo | null {
  if (liberalPolicies >= LIBERAL_WIN_COUNT) {
    return { winner: "liberal", reason: "liberalPolicies" };
  }

  if (fascistPolicies >= FASCIST_WIN_COUNT) {
    return { winner: "fascist", reason: "fascistPolicies" };
  }

  return null;
}
