"use client";

import policyFascist from "@/assets/cards/policy-fascist.png";
import policyLiberal from "@/assets/cards/policy-liberal.png";
import { cn } from "@/lib/cn";
import type { Policy } from "@secret-hitler/shared";
import Image from "next/image";

const policyImages = {
  liberal: policyLiberal,
  fascist: policyFascist,
} as const;

const policyLabels: Record<Policy, string> = {
  liberal: "Política liberal",
  fascist: "Política fascista",
};

interface PolicyCardProps {
  policy: Policy;
  onSelect?: (policy: Policy) => void;
  actionLabel?: string;
  className?: string;
}

export default function PolicyCard(props: PolicyCardProps) {
  const { policy, onSelect, actionLabel, className } = props;

  const image = (
    <Image
      src={policyImages[policy]}
      alt={onSelect ? "" : policyLabels[policy]}
      className="h-auto w-28 sm:w-36"
    />
  );

  if (!onSelect) {
    return <div className={className}>{image}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(policy)}
      aria-label={`${actionLabel ?? "Elegir"} ${policyLabels[policy]}`}
      className={cn("group flex flex-col items-center gap-2", className)}
    >
      <span className="transition-transform duration-150 group-hover:-translate-y-2 group-active:translate-y-0">
        {image}
      </span>
      {actionLabel && (
        <span className="font-body text-xs font-bold tracking-[0.16em] text-highlight uppercase">
          {actionLabel}
        </span>
      )}
    </button>
  );
}
