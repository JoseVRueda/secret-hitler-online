import type { Vote } from "@secret-hitler/shared";

export function tallyVotes(votes: Vote[], aliveCount: number): boolean {
  const jaCount = votes.filter((vote) => vote.vote === "ja").length;

  return jaCount > aliveCount / 2;
}
