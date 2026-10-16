"use client";

import boardDiscard from "@/assets/board/board-discard.png";
import boardDraw from "@/assets/board/board-draw.png";
import boardFascist56 from "@/assets/board/board-fascist-5-6.png";
import boardFascist78 from "@/assets/board/board-fascist-7-8.png";
import boardFascist910 from "@/assets/board/board-fascist-9-10.png";
import boardLiberal from "@/assets/board/board-liberal.png";
import policyFascist from "@/assets/board/board-policy-fascist.png";
import policyLiberal from "@/assets/board/board-policy-liberal.png";
import tracker from "@/assets/board/board-tracker.png";
import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";
import Image, { type StaticImageData } from "next/image";

function fascistBoardFor(playerCount: number): StaticImageData {
  if (playerCount >= 9) return boardFascist910;
  if (playerCount >= 7) return boardFascist78;
  return boardFascist56;
}

function PolicyTiles(props: {
  count: number;
  total: number;
  src: StaticImageData;
  offset: string;
  spacing: string;
  label: string;
}) {
  const { count, total, src, offset, spacing, label } = props;

  return Array.from({ length: total }, (_, index) => {
    const filled = index < count;

    return (
      <Image
        key={index}
        src={src}
        alt={filled ? label : ""}
        data-filled={filled ? "true" : "false"}
        className="policy-tile"
        style={{ left: `calc(${offset} + ${index} * ${spacing})` }}
      />
    );
  });
}

function Pile(props: { src: StaticImageData; label: string; count: number }) {
  const { src, label, count } = props;

  return (
    <figure className="flex w-20 flex-col items-center sm:w-24">
      <Image src={src} alt="" className="h-auto w-full" />
      <figcaption className="mt-2 text-center font-body text-sm font-bold text-muted">
        {label} <span className="font-display text-xl text-cream">{count}</span>
      </figcaption>
    </figure>
  );
}

export function Boards() {
  const room = useRoomStore((state) => state.room);
  const game = useGameStore((state) => state.game);

  if (!room || !game || game.phase === "lobby") return null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3">
      <div className="relative">
        <Image
          src={boardLiberal}
          alt={`${game.liberalPolicies} políticas liberales promulgadas`}
          className="h-auto w-full"
        />
        <Image
          src={tracker}
          alt={`Marcador de elecciones en ${game.electionTracker} de 3`}
          className="election-tracker"
          style={{ left: `calc(34.2% + ${game.electionTracker} * 9.16%)` }}
        />
        <PolicyTiles
          count={game.liberalPolicies}
          total={5}
          src={policyLiberal}
          offset="18.2%"
          spacing="13.54%"
          label="Política liberal"
        />
      </div>

      <div className="relative">
        <Image
          src={fascistBoardFor(room.players.length)}
          alt={`${game.fascistPolicies} políticas fascistas promulgadas`}
          className="h-auto w-full"
        />
        <PolicyTiles
          count={game.fascistPolicies}
          total={6}
          src={policyFascist}
          offset="11%"
          spacing="13.6%"
          label="Política fascista"
        />
      </div>

      {game.vetoUnlocked && (
        <p className="text-center font-body text-xs font-bold tracking-[0.18em] text-highlight uppercase">
          Veto desbloqueado
        </p>
      )}

      <div className="mt-2 flex items-end justify-center gap-8">
        <Pile src={boardDraw} label="Mazo" count={game.deckSize} />
        <Pile src={boardDiscard} label="Descarte" count={game.discardSize} />
      </div>
    </div>
  );
}
