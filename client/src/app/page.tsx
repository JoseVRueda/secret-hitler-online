"use client";

import JoinRoomForm from "@/components/lobby/CreateJoinRoomForm";
import Room from "@/components/room/Room";
import { createRoom, joinRoom } from "@/services/roomService";
import { registerRoomSocketEvents } from "@/sockets/roomSocket";
import { useRoomStore } from "@/store/useRoomStore";
import { useEffect, useState } from "react";

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const room = useRoomStore((s) => s.room);

  useEffect(() => registerRoomSocketEvents(), []);

  if (room) {
    return <Room room={room} />;
  }

  return (
    <JoinRoomForm
      nickname={nickname}
      setNickname={setNickname}
      roomCode={roomCode}
      setRoomCode={setRoomCode}
      createRoom={createRoom}
      joinRoom={joinRoom}
    />
  );
}
