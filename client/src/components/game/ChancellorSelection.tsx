"use client";

import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";
import Panel from "../ui/Panel";

export function ChancellorSelection() {
  const room = useRoomStore((state) => state.room);
  const game = useGameStore((state) => state.game);
  const currentPlayer = useCurrentPlayer();

  if (!room || !game) return null;

  const isPresident = game.presidentSocketId === currentPlayer?.socketId;
  const president = room.players.find(
    (player) => player.socketId === game.presidentSocketId,
  );

  return (
    <Panel title="Selección de canciller">
      <p className="text-center font-body">
        Presidente:{" "}
        <strong className="text-cream">
          {president?.nickname ?? "Desconocido"}
        </strong>
      </p>
      {isPresident ? (
        <p className="mt-4 text-center font-body text-sm text-muted">
          Elige en la mesa a quién nominas como canciller. Los retratos
          atenuados no pueden ser nominados.
        </p>
      ) : (
        <p className="mt-4 text-center font-body text-sm text-muted">
          Esperando a que el presidente elija canciller...
        </p>
      )}
    </Panel>
  );
}
