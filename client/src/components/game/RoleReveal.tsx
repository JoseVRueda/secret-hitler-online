"use client";

import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { acknowledgeRole } from "@/services/gameService";
import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";
import type { PlayerRole } from "@secret-hitler/shared";
import Button from "../ui/Button";
import Panel from "../ui/Panel";
import Stamp from "../ui/Stamp";

const roleInfo: Record<
  PlayerRole,
  {
    label: string;
    icon: string;
    textClass: string;
    borderClass: string;
    bgClass: string;
    stampColor: "liberal" | "fascist" | "ink";
  }
> = {
  liberal: {
    label: "Liberal",
    icon: "🕊️",
    textClass: "text-liberal",
    borderClass: "border-liberal",
    bgClass: "bg-liberal/10",
    stampColor: "liberal",
  },
  fascist: {
    label: "Fascista",
    icon: "🟥",
    textClass: "text-fascist",
    borderClass: "border-fascist",
    bgClass: "bg-fascist/10",
    stampColor: "fascist",
  },
  hitler: {
    label: "Hitler",
    icon: "☠️",
    textClass: "text-ink",
    borderClass: "border-ink",
    bgClass: "bg-ink/10",
    stampColor: "ink",
  },
};

export function RoleReveal() {
  const room = useRoomStore((s) => s.room);
  const game = useGameStore((s) => s.game);
  const privatePlayer = useGameStore((s) => s.privatePlayer);
  const currentPlayer = useCurrentPlayer();

  if (!room || !game || !privatePlayer?.role) return null;

  const hasAcknowledged = game.rolesAcknowledgedBy.includes(
    currentPlayer?.socketId ?? "",
  );
  const acknowledgedCount = game.rolesAcknowledgedBy.length;
  const totalPlayers = room.players.length;
  const info = roleInfo[privatePlayer.role];

  return (
    <Panel
      title="Dossier secreto"
      stamp={
        <Stamp color="blood" className="animate-stamp-in">
          Confidencial
        </Stamp>
      }
    >
      <div
        className={`deco-frame flex flex-col items-center gap-2 border-4 py-8 ${info.borderClass} ${info.bgClass}`}
      >
        <span className="font-stamp text-xs uppercase tracking-[0.3em] text-ink/60">
          Tu identidad es
        </span>
        <span
          className={`font-poster text-4xl uppercase tracking-wide ${info.textClass}`}
        >
          {info.icon} {info.label}
        </span>
      </div>

      {privatePlayer.knownPlayers.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 border-b border-ink/30 pb-2 font-stamp text-xs uppercase tracking-[0.25em] text-ink/70">
            Expediente — jugadores que conoces
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {privatePlayer.knownPlayers.map((p) => (
              <li
                key={p.socketId}
                className="flex items-center justify-between gap-3 border border-ink/30 bg-parchment-dark/40 px-3 py-2"
              >
                <span className="font-stamp text-sm uppercase tracking-wide text-ink">
                  {p.nickname}
                </span>
                {p.role && (
                  <Stamp
                    color={roleInfo[p.role].stampColor}
                    className="text-[0.6rem]"
                  >
                    {roleInfo[p.role].label}
                  </Stamp>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        {!hasAcknowledged ? (
          <Button onClick={() => acknowledgeRole(room.code)}>
            He leído mi rol — continuar
          </Button>
        ) : (
          <p className="font-stamp text-sm text-ink/60">
            Esperando al resto de jugadores ({acknowledgedCount}/
            {totalPlayers})
          </p>
        )}
      </div>
    </Panel>
  );
}
