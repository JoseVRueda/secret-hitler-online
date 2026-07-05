"use client";

import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { selectChancellor } from "@/services/gameService";
import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";
import Button from "../ui/Button";
import Panel from "../ui/Panel";
import Stamp from "../ui/Stamp";

export function ChancellorSelection() {
  const room = useRoomStore((s) => s.room);
  const game = useGameStore((s) => s.game);
  const currentPlayer = useCurrentPlayer();

  if (!room || !game) return null;

  const isPresident = game.presidentSocketId === currentPlayer?.socketId;

  const president = room.players.find(
    (p) => p.socketId === game.presidentSocketId,
  );

  const candidates = room.players.filter(
    (p) => p.socketId !== game.presidentSocketId,
  );

  return (
    <Panel
      title="Selección de canciller"
      stamp={
        <Stamp color="gold" className="animate-stamp-in">
          Nominación
        </Stamp>
      }
    >
      <div className="deco-frame flex items-center justify-between gap-3 border-2 border-ink/40 bg-parchment-dark/40 px-4 py-3">
        <span className="font-stamp text-xs uppercase tracking-[0.25em] text-ink/60">
          Presidente actual
        </span>
        <span className="font-poster text-lg uppercase tracking-wide text-ink">
          {president?.nickname ?? "Desconocido"}
        </span>
      </div>

      {!isPresident && (
        <p className="mt-5 font-stamp text-sm text-ink/60">
          Esperando a que el presidente elija canciller...
        </p>
      )}

      {isPresident && (
        <div className="mt-5">
          <h3 className="mb-3 border-b border-ink/30 pb-2 font-stamp text-xs uppercase tracking-[0.25em] text-ink/70">
            Papeleta de nominación
          </h3>
          <div className="flex flex-col gap-3">
            {candidates.map((player) => (
              <Button
                key={player.socketId}
                onClick={() => selectChancellor(room.code, player.socketId)}
                color="secondary"
                variant="outlined"
                className="justify-between"
              >
                <span>Nominar a {player.nickname}</span>
                <span aria-hidden="true">✒️</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}
