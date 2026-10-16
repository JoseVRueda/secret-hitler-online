"use client";

import membershipFascist from "@/assets/cards/party-membership-fascist.png";
import membershipLiberal from "@/assets/cards/party-membership-liberal.png";
import { useGameStore } from "@/store/useGameStore";
import Image from "next/image";
import { useState } from "react";
import Button from "../ui/Button";
import Panel from "../ui/Panel";

export function InvestigationReveal() {
  const result = useGameStore(
    (state) => state.privatePlayer?.investigationResult,
  );
  const key = result ? `${result.nickname}:${result.party}` : null;
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);

  if (!result || !key || key === dismissedKey) return null;

  const card =
    result.party === "liberal" ? membershipLiberal : membershipFascist;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-panel/80 p-4">
      <Panel
        title={`Afiliación de ${result.nickname}`}
        className="w-full max-w-sm"
      >
        <Image
          src={card}
          alt={
            result.party === "liberal"
              ? "Afiliación liberal"
              : "Afiliación fascista"
          }
          className="mx-auto h-auto w-48"
        />
        <div className="mt-6 flex justify-center">
          <Button onClick={() => setDismissedKey(key)}>
            He visto la afiliación
          </Button>
        </div>
      </Panel>
    </div>
  );
}
