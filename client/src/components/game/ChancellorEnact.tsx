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
import Panel from "../ui/Panel";
import PolicyCard from "../ui/PolicyCard";

export function ChancellorEnact() {
  const room = useRoomStore((state) => state.room);
  const game = useGameStore((state) => state.game);
  const privatePlayer = useGameStore((state) => state.privatePlayer);
  const currentPlayer = useCurrentPlayer();

  if (!room || !game) return null;

  const isChancellor = game.chancellorSocketId === currentPlayer?.socketId;
  const isPresident = game.presidentSocketId === currentPlayer?.socketId;
  const policies = privatePlayer?.policiesToAct ?? [];

  return (
    <Panel title="Promulgación">
      {game.vetoRequested && (
        <div className="rounded-md border border-highlight/50 bg-highlight/10 p-4 text-center">
          <p className="font-body font-bold text-highlight">Veto solicitado</p>
          {isPresident && (
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button onClick={() => confirmVeto(room.code, true)}>
                Aceptar veto
              </Button>
              <Button
                color="liberal"
                onClick={() => confirmVeto(room.code, false)}
              >
                Rechazar veto
              </Button>
            </div>
          )}
          {isChancellor && !isPresident && (
            <p className="mt-2 font-body text-sm text-muted">
              Esperando respuesta del presidente...
            </p>
          )}
          {!isChancellor && !isPresident && (
            <p className="mt-2 font-body text-sm text-muted">
              El presidente decide si acepta el veto...
            </p>
          )}
        </div>
      )}

      {!game.vetoRequested && isChancellor && policies.length > 0 && (
        <>
          <p className="text-center font-body">
            Elige una carta para promulgar. La otra irá al descarte.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {policies.map((policy, index) => (
              <PolicyCard
                key={`${policy}-${index}`}
                policy={policy}
                actionLabel="Promulgar"
                onSelect={(selected) => chancellorEnact(room.code, selected)}
              />
            ))}
          </div>
          {game.vetoUnlocked && (
            <div className="mt-6 flex justify-center">
              <Button
                color="liberal"
                variant="outlined"
                onClick={() => requestVeto(room.code)}
              >
                Solicitar veto
              </Button>
            </div>
          )}
        </>
      )}

      {!game.vetoRequested && isChancellor && policies.length === 0 && (
        <p className="text-center font-body text-sm text-muted">
          Esperando cartas...
        </p>
      )}

      {!game.vetoRequested && !isChancellor && (
        <p className="text-center font-body text-sm text-muted">
          El canciller está eligiendo qué carta promulgar...
        </p>
      )}
    </Panel>
  );
}
