"use client";

import { useGameStore } from "@/store/useGameStore";
import type { GamePhase } from "@secret-hitler/shared";
import { StartGameButton } from "../room/StartGameButton";
import { ChancellorSelection } from "./ChancellorSelection";
import { RoleReveal } from "./RoleReveal";

interface GamePhaseViewProps {
  roomCode: string;
}

function GamePhasePlaceholder(props: { title: string; description: string }) {
  const { title, description } = props;

  return (
    <section className="rounded-xl border p-6">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm opacity-70">{description}</p>
    </section>
  );
}

const upcomingPhaseCopy: Partial<
  Record<GamePhase, { title: string; description: string }>
> = {
  voting: {
    title: "Votación",
    description: "La votación del gobierno estará disponible pronto.",
  },
  legislativeSession: {
    title: "Sesión legislativa",
    description: "El presidente y el canciller legislarán pronto.",
  },
  executiveAction: {
    title: "Acción ejecutiva",
    description: "Las acciones presidenciales estarán disponibles pronto.",
  },
  gameOver: {
    title: "Fin de partida",
    description: "La partida ha terminado.",
  },
};

export function GamePhaseView(props: GamePhaseViewProps) {
  const { roomCode } = props;
  const game = useGameStore((s) => s.game);
  const phase = game?.phase ?? "lobby";

  switch (phase) {
    case "lobby":
      return <StartGameButton roomCode={roomCode} />;
    case "roleAssignment":
      return <RoleReveal />;
    case "chancellorSelection":
      return <ChancellorSelection />;
    default: {
      const copy = upcomingPhaseCopy[phase];

      if (!copy) return null;

      return (
        <GamePhasePlaceholder
          title={copy.title}
          description={copy.description}
        />
      );
    }
  }
}
