"use client";

import { useGameStore } from "@/store/useGameStore";
import type { GamePhase } from "@secret-hitler/shared";
import { StartGameButton } from "../room/StartGameButton";
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

function renderPhase(phase: GamePhase, roomCode: string) {
  switch (phase) {
    case "lobby":
      return <StartGameButton roomCode={roomCode} />;
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
  const game = useGameStore((s) => s.game);
  const phase = game?.phase ?? "lobby";

  return (
    <div key={phase} className="animate-stamp-in">
      {renderPhase(phase, roomCode)}
    </div>
  );
}
