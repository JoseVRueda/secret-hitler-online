"use client";

import type { Policy } from "@secret-hitler/shared";
import Button from "../ui/Button";

interface PolicyCardProps {
  policy: Policy;
  onSelect: (policy: Policy) => void;
  actionLabel: string;
}

const policyLabels: Record<Policy, string> = {
  liberal: "Liberal",
  fascist: "Fascista",
};

const policyColors: Record<Policy, string> = {
  liberal: "border-blue-400 bg-blue-900/30 hover:bg-blue-800/50",
  fascist: "border-red-500 bg-red-900/30 hover:bg-red-800/50",
};

export function PolicyCard(props: PolicyCardProps) {
  const { policy, onSelect, actionLabel } = props;

  return (
    <Button
      onClick={() => onSelect(policy)}
      color={policy === "liberal" ? "primary" : "secondary"}
      variant="outlined"
      className={`min-w-32 border-2 py-4 ${policyColors[policy]}`}
    >
      {policyLabels[policy]} — {actionLabel}
    </Button>
  );
}
