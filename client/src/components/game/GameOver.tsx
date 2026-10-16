"use client";

import fascistFooter from "@/assets/victory/victory-fascist-footer.png";
import fascistHeader from "@/assets/victory/victory-fascist-header.png";
import liberalFooter from "@/assets/victory/victory-liberal-footer.png";
import liberalHeader from "@/assets/victory/victory-liberal-header.png";
import { useGameStore } from "@/store/useGameStore";
import type { WinReason } from "@secret-hitler/shared";
import Image from "next/image";
import Panel from "../ui/Panel";

const winReasonLabels: Record<WinReason, string> = {
  liberalPolicies: "5 políticas liberales promulgadas",
  fascistPolicies: "6 políticas fascistas promulgadas",
  hitlerElected: "Hitler fue elegido canciller con 3 o más políticas fascistas",
  hitlerExecuted: "Hitler fue ejecutado",
};

export function GameOver() {
  const game = useGameStore((state) => state.game);

  if (!game?.winInfo) return null;

  const { winner, reason } = game.winInfo;
  const liberal = winner === "liberal";

  return (
    <Panel title={liberal ? "Victoria liberal" : "Victoria fascista"}>
      <Image
        src={liberal ? liberalHeader : fascistHeader}
        alt=""
        className="mx-auto h-auto w-full max-w-lg"
      />
      <p className="my-4 text-center font-body text-sm text-muted">
        {winReasonLabels[reason]}
      </p>
      <p className="mb-4 text-center font-body text-sm text-cream">
        Los roles están revelados en la mesa.
      </p>
      <Image
        src={liberal ? liberalFooter : fascistFooter}
        alt=""
        className="mx-auto h-auto w-full max-w-lg"
      />
    </Panel>
  );
}
