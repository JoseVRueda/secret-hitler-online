import type { PlayerRole } from "@secret-hitler/shared";
import type { WinInfo } from "@secret-hitler/shared";
import { checkPolicyCountWin } from "./board.js";

export function checkHitlerElectedWin(
  chancellorRole: PlayerRole,
  fascistPolicies: number,
): WinInfo | null {
  if (chancellorRole === "hitler" && fascistPolicies >= 3) {
    return { winner: "fascist", reason: "hitlerElected" };
  }

  return null;
}

export function checkHitlerExecutedWin(
  executedPlayerRole: PlayerRole,
): WinInfo | null {
  if (executedPlayerRole === "hitler") {
    return { winner: "liberal", reason: "hitlerExecuted" };
  }

  return null;
}

export function checkWinConditions(params: {
  liberalPolicies: number;
  fascistPolicies: number;
  chancellorRole?: PlayerRole;
  executedPlayerRole?: PlayerRole;
}): WinInfo | null {
  const policyWin = checkPolicyCountWin(
    params.liberalPolicies,
    params.fascistPolicies,
  );

  if (policyWin) {
    return policyWin;
  }

  if (params.chancellorRole) {
    const hitlerElectedWin = checkHitlerElectedWin(
      params.chancellorRole,
      params.fascistPolicies,
    );

    if (hitlerElectedWin) {
      return hitlerElectedWin;
    }
  }

  if (params.executedPlayerRole) {
    return checkHitlerExecutedWin(params.executedPlayerRole);
  }

  return null;
}
