"use client";

import { useGameStore } from "@/store/useGameStore";
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
