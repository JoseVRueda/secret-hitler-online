"use client";

import { useGameStore } from "@/store/useGameStore";
import type { PublicRoom } from "@secret-hitler/shared";
import GameTable from "./GameTable";
import LobbyView from "./LobbyView";

interface RoomProps {
  room: PublicRoom;
}

export default function Room(props: RoomProps) {
  const { room } = props;
  const phase = useGameStore((state) => state.game?.phase ?? "lobby");

  if (phase === "lobby") {
    return <LobbyView room={room} />;
  }

  return <GameTable room={room} />;
}
