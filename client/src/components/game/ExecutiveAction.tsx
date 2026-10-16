"use client";

import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { acknowledgePeek, executiveAction } from "@/services/gameService";
import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";
import type { ExecutivePower } from "@secret-hitler/shared";
import Button from "../ui/Button";
import Panel from "../ui/Panel";
import PolicyCard from "../ui/PolicyCard";

const powerTitles: Record<ExecutivePower, string> = {
  investigateLoyalty: "Investigar lealtad",
  specialElection: "Elección especial",
  policyPeek: "Ojear políticas",
  execution: "Ejecución",
};

const powerDescriptions: Record<ExecutivePower, string> = {
  investigateLoyalty:
    "Elige en la mesa a un jugador vivo que aún no hayas investigado.",
  specialElection:
    "Elige en la mesa al jugador que será el próximo presidente.",
  policyPeek: "Mira las 3 cartas superiores del mazo.",
  execution: "Elige en la mesa al jugador que quieres eliminar.",
};

export function ExecutiveAction() {
  const room = useRoomStore((state) => state.room);
  const game = useGameStore((state) => state.game);
  const privatePlayer = useGameStore((state) => state.privatePlayer);
  const currentPlayer = useCurrentPlayer();

  if (!room || !game || game.phase !== "executiveAction") return null;

  const isPresident = game.presidentSocketId === currentPlayer?.socketId;
  const power = game.pendingPower;
  const policyPeek = privatePlayer?.policyPeek ?? [];
  const activePower: ExecutivePower = power ?? "policyPeek";

  if (!power && policyPeek.length === 0) return null;

  return (
    <Panel title={powerTitles[activePower]}>
      <p className="text-center font-body text-sm text-muted">
        {powerDescriptions[activePower]}
      </p>

      {!isPresident && (
        <p className="mt-4 text-center font-body text-sm text-muted">
          El presidente está usando su poder ejecutivo...
        </p>
      )}

      {isPresident && power === "policyPeek" && policyPeek.length === 0 && (
        <div className="mt-6 flex justify-center">
          <Button onClick={() => executiveAction(room.code)}>
            Ojear las 3 cartas superiores
          </Button>
        </div>
      )}

      {isPresident && policyPeek.length > 0 && (
        <div className="mt-6">
          <div className="flex flex-wrap justify-center gap-3">
            {policyPeek.map((policy, index) => (
              <PolicyCard key={`${policy}-${index}`} policy={policy} />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Button onClick={() => acknowledgePeek(room.code)}>
              He visto las cartas
            </Button>
          </div>
        </div>
      )}
    </Panel>
  );
}
