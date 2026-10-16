"use client";

import { useGameStore } from "@/store/useGameStore";
import type { GamePhase } from "@secret-hitler/shared";
import { ChancellorEnact } from "./ChancellorEnact";
import { ChancellorSelection } from "./ChancellorSelection";
import { ExecutiveAction } from "./ExecutiveAction";
import { GameOver } from "./GameOver";
import { PresidentLegislative } from "./PresidentLegislative";
import { RoleReveal } from "./RoleReveal";
import { VotingBooth } from "./VotingBooth";

interface GamePhaseViewProps {
  roomCode: string;
}

function renderPhase(phase: GamePhase) {
  switch (phase) {
    case "roleAssignment":
      return <RoleReveal />;
    case "chancellorSelection":
      return <ChancellorSelection />;
    case "voting":
      return <VotingBooth />;
    case "presidentLegislative":
      return <PresidentLegislative />;
    case "chancellorEnact":
      return <ChancellorEnact />;
    case "executiveAction":
      return <ExecutiveAction />;
    case "gameOver":
      return <GameOver />;
    default:
      return null;
  }
}

export function GamePhaseView(props: GamePhaseViewProps) {
  const { roomCode } = props;
  const game = useGameStore((state) => state.game);
  const phase = game?.phase ?? "lobby";

  if (phase === "lobby") return null;

  return (
    <div key={`${phase}-${roomCode}`} className="animate-rise">
      {renderPhase(phase)}
    </div>
  );
}
