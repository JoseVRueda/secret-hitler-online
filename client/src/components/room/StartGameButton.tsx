"use client";

import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { startGame } from "@/services/gameService";
import Button from "../ui/Button";

interface StartGameButtonProps {
  roomCode: string;
}

export function StartGameButton(props: StartGameButtonProps) {
  const { roomCode } = props;

  const currentPlayer = useCurrentPlayer();
  if (!currentPlayer?.isHost) return null;

  return (
    <Button onClick={() => startGame(roomCode)} color="secondary">
      Iniciar partida
    </Button>
  );
}
