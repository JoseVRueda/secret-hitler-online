import type { Policy } from "@secret-hitler/shared";
import Stamp from "./Stamp";

interface PolicyCardProps {
  policy: Policy;
  faceDown?: boolean;
  className?: string;
}

const policyLabels: Record<Policy, string> = {
  liberal: "Liberal",
  fascist: "Fascista",
};

const policyFaceClasses: Record<Policy, string> = {
  liberal: "border-liberal bg-liberal/15 text-liberal",
  fascist: "border-fascist bg-fascist/15 text-fascist",
};

export default function PolicyCard(props: PolicyCardProps) {
  const { policy, faceDown = false, className } = props;

  const classes = [
    "deco-frame paper flex h-36 w-24 sm:h-44 sm:w-28 shrink-0 flex-col items-center justify-center gap-3",
    "rounded-sm border-4 shadow-lg [backface-visibility:hidden]",
    faceDown ? "animate-flip border-ink bg-ink text-parchment" : "animate-flip",
    !faceDown && policyFaceClasses[policy],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {faceDown ? (
        <Stamp color="gold">Secreto</Stamp>
      ) : (
        <>
          <span className="font-poster text-xs uppercase tracking-[0.2em] opacity-70">
            Política
          </span>
          <span className="font-poster text-lg sm:text-xl uppercase tracking-wide">
            {policyLabels[policy]}
          </span>
        </>
      )}
    </div>
  );
}
