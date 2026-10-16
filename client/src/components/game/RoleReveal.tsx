"use client";

import envelopeBack from "@/assets/cards/role-envelope-back.png";
import envelopeFront from "@/assets/cards/role-envelope-front.png";
import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { cn } from "@/lib/cn";
import { getRoleCard } from "@/lib/roleCards";
import { acknowledgeRole } from "@/services/gameService";
import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";
import type { PlayerRole } from "@secret-hitler/shared";
import Image from "next/image";
import { useState } from "react";
import PlayerRow from "../player/PlayerRow";
import Button from "../ui/Button";
import Panel from "../ui/Panel";

const roleLabels: Record<PlayerRole, string> = {
  liberal: "Liberal",
  fascist: "Fascista",
  hitler: "Hitler",
};

const roleTextClass: Record<PlayerRole, string> = {
  liberal: "text-liberal",
  fascist: "text-fascist",
  hitler: "text-cream",
};

type EnvelopeStage = "closed" | "back" | "open";

export function RoleReveal() {
  const room = useRoomStore((state) => state.room);
  const game = useGameStore((state) => state.game);
  const privatePlayer = useGameStore((state) => state.privatePlayer);
  const currentPlayer = useCurrentPlayer();
  const hasAcknowledged = game?.rolesAcknowledgedBy.includes(
    currentPlayer?.socketId ?? "",
  );
  const [stage, setStage] = useState<EnvelopeStage>(
    hasAcknowledged ? "open" : "closed",
  );

  if (!room || !game || !privatePlayer?.role || !currentPlayer) return null;

  const playerIndex = Math.max(
    0,
    room.players.findIndex(
      (player) => player.socketId === currentPlayer.socketId,
    ),
  );
  const role = privatePlayer.role;
  const acknowledgedCount = game.rolesAcknowledgedBy.length;
  const knownPlayers = privatePlayer.knownPlayers.flatMap((known) => {
    const player = room.players.find(
      (candidate) => candidate.socketId === known.socketId,
    );
    return player ? [player] : [];
  });
  const knownRoles = Object.fromEntries(
    privatePlayer.knownPlayers
      .filter((known) => known.role)
      .map((known) => [known.socketId, known.role]),
  );

  function openEnvelope() {
    setStage("back");
    window.setTimeout(() => setStage("open"), 700);
  }

  return (
    <Panel title="Tu identidad">
      <div className="mx-auto w-48 [perspective:1000px] sm:w-56">
        {stage === "open" ? (
          <Image
            src={getRoleCard(role, playerIndex)}
            alt={`Carta de rol ${roleLabels[role]}`}
            className="h-auto w-full animate-rise"
          />
        ) : (
          <div
            className={cn(
              "relative transition-transform duration-700 [transform-style:preserve-3d]",
              stage === "back" && "[transform:rotateY(180deg)]",
            )}
          >
            <Image
              src={envelopeFront}
              alt="Sobre cerrado"
              className="h-auto w-full [backface-visibility:hidden]"
            />
            <Image
              src={envelopeBack}
              alt=""
              className="absolute inset-0 h-auto w-full [transform:rotateY(180deg)] [backface-visibility:hidden]"
            />
          </div>
        )}
      </div>

      {stage === "open" && (
        <p
          className={cn(
            "mt-4 text-center font-display text-3xl tracking-wide",
            roleTextClass[role],
          )}
        >
          {roleLabels[role]}
        </p>
      )}

      {stage === "closed" && (
        <div className="mt-6 flex justify-center">
          <Button onClick={openEnvelope}>Abrir el sobre</Button>
        </div>
      )}

      {stage === "open" && knownPlayers.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-center font-body text-xs font-bold tracking-[0.2em] text-muted uppercase">
            Jugadores que conoces
          </h3>
          <PlayerRow players={knownPlayers} roles={knownRoles} />
        </div>
      )}

      {stage === "open" && (
        <div className="mt-6 flex flex-col items-center gap-3">
          {!hasAcknowledged ? (
            <Button onClick={() => acknowledgeRole(room.code)}>
              He leído mi rol
            </Button>
          ) : (
            <p className="font-body text-sm text-muted">
              Esperando al resto de jugadores ({acknowledgedCount}/
              {room.players.length})
            </p>
          )}
        </div>
      )}
    </Panel>
  );
}
