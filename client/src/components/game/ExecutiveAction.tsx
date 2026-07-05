"use client";

import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import {
  acknowledgePeek,
  executiveAction,
} from "@/services/gameService";
import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";
import type { ExecutivePower } from "@secret-hitler/shared";
import Button from "../ui/Button";

const powerTitles: Record<ExecutivePower, string> = {
  investigateLoyalty: "Investigar lealtad",
  specialElection: "Elección especial",
  policyPeek: "Ojear políticas",
  execution: "Ejecución",
};

const powerDescriptions: Record<ExecutivePower, string> = {
  investigateLoyalty:
    "Elige un jugador vivo para conocer su afiliación (liberal o fascista).",
  specialElection:
    "Elige un jugador para que sea el próximo presidente en esta ronda.",
  policyPeek: "Mira las 3 cartas superiores del mazo.",
  execution: "Elige un jugador para eliminar de la partida.",
};

export function ExecutiveAction() {
  const room = useRoomStore((s) => s.room);
  const game = useGameStore((s) => s.game);
  const privatePlayer = useGameStore((s) => s.privatePlayer);
  const currentPlayer = useCurrentPlayer();

  if (!room || !game || game.phase !== "executiveAction") return null;

  const isPresident =
    game.presidentSocketId === currentPlayer?.socketId;
  const power = game.pendingPower;
  const policyPeek = privatePlayer?.policyPeek;

  if (!power && !policyPeek?.length) return null;

  const activePower: ExecutivePower = power ?? "policyPeek";
  const alivePlayers = room.players.filter(
    (p) =>
      !game.deadPlayerSocketIds.includes(p.socketId) &&
      p.socketId !== game.presidentSocketId,
  );

  return (
    <section className="rounded-xl border p-6">
      <h2 className="text-xl font-bold">{powerTitles[activePower]}</h2>
      <p className="mt-2 text-sm opacity-70">
        {powerDescriptions[activePower]}
      </p>

      {!isPresident && (
        <p className="mt-4 text-sm opacity-70">
          El presidente está usando su poder ejecutivo...
        </p>
      )}

      {isPresident && power === "policyPeek" && !policyPeek?.length && (
        <div className="mt-6">
          <Button onClick={() => executiveAction(room.code)}>
            Ojear las 3 cartas superiores
          </Button>
        </div>
      )}

      {isPresident && policyPeek && policyPeek.length > 0 && (
        <div className="mt-6">
          <p className="mb-4 font-medium">Cartas superiores del mazo:</p>
          <div className="flex flex-wrap gap-3">
            {policyPeek.map((policy, index) => (
              <span
                key={`${policy}-${index}`}
                className={`rounded border-2 px-4 py-2 ${
                  policy === "liberal"
                    ? "border-blue-400 bg-blue-900/40"
                    : "border-red-500 bg-red-900/40"
                }`}
              >
                {policy === "liberal" ? "Liberal" : "Fascista"}
              </span>
            ))}
          </div>
          <div className="mt-6">
            <Button onClick={() => acknowledgePeek(room.code)}>
              He visto las cartas — continuar
            </Button>
          </div>
        </div>
      )}

      {isPresident &&
        (power === "investigateLoyalty" ||
          power === "specialElection" ||
          power === "execution") && (
          <div className="mt-6 flex flex-col gap-2">
            {alivePlayers.map((player) => (
              <Button
                key={player.socketId}
                onClick={() =>
                  executiveAction(room.code, player.socketId)
                }
                color="secondary"
                variant="outlined"
              >
                {power === "execution" ? "Ejecutar" : "Elegir"} a{" "}
                {player.nickname}
              </Button>
            ))}
            {power === "specialElection" && alivePlayers.length === 0 && (
              <p className="text-sm opacity-70">
                No hay candidatos disponibles.
              </p>
            )}
          </div>
        )}
    </section>
  );
}
