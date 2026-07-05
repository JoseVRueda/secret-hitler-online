"use client";

import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";
import type { WinReason } from "@secret-hitler/shared";

const winReasonLabels: Record<WinReason, string> = {
  liberalPolicies: "5 políticas liberales promulgadas",
  fascistPolicies: "6 políticas fascistas promulgadas",
  hitlerElected: "Hitler fue elegido canciller con 3+ políticas fascistas",
  hitlerExecuted: "Hitler fue ejecutado",
};

const roleLabels = {
  liberal: "Liberal",
  fascist: "Fascista",
  hitler: "Hitler",
} as const;

export function GameOver() {
  const room = useRoomStore((s) => s.room);
  const game = useGameStore((s) => s.game);

  if (!room || !game?.winInfo) return null;

  const { winner, reason } = game.winInfo;

  return (
    <section className="rounded-xl border p-6">
      <h2 className="text-2xl font-bold">Fin de partida</h2>

      <div className="mt-6">
        <p className="text-xl">
          {winner === "liberal" ? (
            <span className="text-blue-400">🕊️ Victoria liberal</span>
          ) : (
            <span className="text-red-400">🟥 Victoria fascista</span>
          )}
        </p>
        <p className="mt-2 text-sm opacity-70">{winReasonLabels[reason]}</p>
      </div>

      {game.roles && game.roles.length > 0 && (
        <div className="mt-8">
          <h3 className="font-bold">Roles revelados</h3>
          <ul className="mt-4 space-y-2">
            {game.roles.map(({ socketId, role }) => {
              const player = room.players.find(
                (p) => p.socketId === socketId,
              );

              return (
                <li key={socketId} className="flex justify-between text-sm">
                  <span>{player?.nickname ?? socketId}</span>
                  <span className="opacity-70">{roleLabels[role]}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
