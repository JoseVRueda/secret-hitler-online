"use client";

import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { startGame } from "@/services/gameService";
import { useRoomStore } from "@/store/useRoomStore";
import Button from "../ui/Button";

interface StartGameButtonProps {
  roomCode: string;
}

export function StartGameButton(props: StartGameButtonProps) {
  const { roomCode } = props;

  const currentPlayer = useCurrentPlayer();
  const playerCount = useRoomStore((state) => state.room?.players.length ?? 0);

  if (!currentPlayer?.isHost) return null;

  return (
    <Button
      onClick={() => startGame(roomCode)}
      disabled={playerCount < 5 || playerCount > 10}
    >
      Iniciar partida
    </Button>
  );
}
