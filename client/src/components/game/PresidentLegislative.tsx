"use client";

import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { presidentDiscard } from "@/services/gameService";
import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";
import PolicyCard from "../ui/PolicyCard";
import Panel from "../ui/Panel";

export function PresidentLegislative() {
  const room = useRoomStore((state) => state.room);
  const game = useGameStore((state) => state.game);
  const privatePlayer = useGameStore((state) => state.privatePlayer);
  const currentPlayer = useCurrentPlayer();

  if (!room || !game) return null;

  const isPresident = game.presidentSocketId === currentPlayer?.socketId;
  const policies = privatePlayer?.policiesToAct ?? [];

  return (
    <Panel title="Sesión legislativa">
      {!isPresident && (
        <p className="text-center font-body text-sm text-muted">
          El presidente está descartando una carta...
        </p>
      )}

      {isPresident && policies.length > 0 && (
        <>
          <p className="text-center font-body">
            Has recibido 3 cartas. Descarta una para pasar las otras dos al
            canciller.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {policies.map((policy, index) => (
              <PolicyCard
                key={`${policy}-${index}`}
                policy={policy}
                actionLabel="Descartar"
                onSelect={(selected) => presidentDiscard(room.code, selected)}
              />
            ))}
          </div>
        </>
      )}

      {isPresident && policies.length === 0 && (
        <p className="text-center font-body text-sm text-muted">
          Esperando cartas...
        </p>
      )}
    </Panel>
  );
}
