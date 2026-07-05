import type { Policy } from "@secret-hitler/shared";
import { shuffleArray } from "@/utils/shuffleArray.js";

const LIBERAL_POLICY_COUNT = 6;
const FASCIST_POLICY_COUNT = 11;
const RESHUFFLE_THRESHOLD = 3;

export type DrawPoliciesResult = {
  deck: Policy[];
  discard: Policy[];
  drawn: Policy[];
};

export function createPolicyDeck(): Policy[] {
  const deck: Policy[] = [
    ...Array<Policy>(LIBERAL_POLICY_COUNT).fill("liberal"),
    ...Array<Policy>(FASCIST_POLICY_COUNT).fill("fascist"),
  ];

  return shuffleArray(deck);
}

export function drawPolicies(
  deck: Policy[],
  discard: Policy[],
  count: number,
): DrawPoliciesResult {
  let currentDeck = [...deck];
  let currentDiscard = [...discard];

  if (currentDeck.length < RESHUFFLE_THRESHOLD && currentDiscard.length > 0) {
    currentDeck = shuffleArray([...currentDeck, ...currentDiscard]);
    currentDiscard = [];
  }

  const drawn = currentDeck.slice(0, count);
  const remainingDeck = currentDeck.slice(count);

  return {
    deck: remainingDeck,
    discard: currentDiscard,
    drawn,
  };
}
