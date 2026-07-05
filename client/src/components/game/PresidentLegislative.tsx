"use client";

import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { presidentDiscard } from "@/services/gameService";
import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";
import { PolicyCard } from "./PolicyCard";

export function PresidentLegislative() {
  const room = useRoomStore((s) => s.room);
  const game = useGameStore((s) => s.game);
  const privatePlayer = useGameStore((s) => s.privatePlayer);
  const currentPlayer = useCurrentPlayer();

  if (!room || !game) return null;

  const isPresident =
    game.presidentSocketId === currentPlayer?.socketId;
  const policies = privatePlayer?.policiesToAct ?? [];

  return (
    <section className="rounded-xl border p-6">
      <h2 className="text-xl font-bold">Sesión legislativa — Presidente</h2>

      {!isPresident && (
        <p className="mt-4 text-sm opacity-70">
          El presidente está descartando una carta...
        </p>
      )}

      {isPresident && policies.length > 0 && (
        <>
          <p className="mt-4">
            Has recibido 3 cartas. Descarta una para pasar las otras dos al
            canciller.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {policies.map((policy, index) => (
              <PolicyCard
                key={`${policy}-${index}`}
                policy={policy}
                actionLabel="Descartar"
                onSelect={(p) => presidentDiscard(room.code, p)}
              />
            ))}
          </div>
        </>
      )}

      {isPresident && policies.length === 0 && (
        <p className="mt-4 text-sm opacity-70">Esperando cartas...</p>
      )}
    </section>
  );
}
