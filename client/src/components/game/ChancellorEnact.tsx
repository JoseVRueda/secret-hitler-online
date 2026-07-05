"use client";

import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import {
  chancellorEnact,
  confirmVeto,
  requestVeto,
} from "@/services/gameService";
import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";
import Button from "../ui/Button";
import { PolicyCard } from "./PolicyCard";

export function ChancellorEnact() {
  const room = useRoomStore((s) => s.room);
  const game = useGameStore((s) => s.game);
  const privatePlayer = useGameStore((s) => s.privatePlayer);
  const currentPlayer = useCurrentPlayer();

  if (!room || !game) return null;

  const isChancellor =
    game.chancellorSocketId === currentPlayer?.socketId;
  const isPresident =
    game.presidentSocketId === currentPlayer?.socketId;
  const policies = privatePlayer?.policiesToAct ?? [];

  return (
    <section className="rounded-xl border p-6">
      <h2 className="text-xl font-bold">Promulgación — Canciller</h2>

      {game.vetoRequested && (
        <div className="mt-4 rounded-lg border border-yellow-600 bg-yellow-900/20 p-4">
          <p className="font-medium text-yellow-300">
            Veto solicitado
          </p>
          {isPresident && (
            <div className="mt-4 flex gap-4">
              <Button onClick={() => confirmVeto(room.code, true)}>
                Aceptar veto
              </Button>
              <Button
                onClick={() => confirmVeto(room.code, false)}
                color="secondary"
              >
                Rechazar veto
              </Button>
            </div>
          )}
          {isChancellor && !isPresident && (
            <p className="mt-2 text-sm opacity-70">
              Esperando respuesta del presidente...
            </p>
          )}
          {!isChancellor && !isPresident && (
            <p className="mt-2 text-sm opacity-70">
              El presidente decide si acepta el veto...
            </p>
          )}
        </div>
      )}

      {!game.vetoRequested && isChancellor && policies.length > 0 && (
        <>
          <p className="mt-4">
            Elige una carta para promulgar. La otra irá al descarte.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {policies.map((policy, index) => (
              <PolicyCard
                key={`${policy}-${index}`}
                policy={policy}
                actionLabel="Promulgar"
                onSelect={(p) => chancellorEnact(room.code, p)}
              />
            ))}
          </div>
          {game.vetoUnlocked && (
            <div className="mt-6">
              <Button
                onClick={() => requestVeto(room.code)}
                color="secondary"
                variant="outlined"
              >
                Solicitar veto
              </Button>
            </div>
          )}
        </>
      )}

      {!game.vetoRequested && isChancellor && policies.length === 0 && (
        <p className="mt-4 text-sm opacity-70">Esperando cartas...</p>
      )}

      {!game.vetoRequested && !isChancellor && (
        <p className="mt-4 text-sm opacity-70">
          El canciller está eligiendo qué carta promulgar...
        </p>
      )}
    </section>
  );
}
