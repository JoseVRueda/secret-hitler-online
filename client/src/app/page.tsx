"use client";

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
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold">Sala: {room.code}</h1>

        <div className="mt-6">
          {room.players.map((player) => (
            <div key={player.socketId}>
              {player.nickname}
              {player.isHost && " 👑"}
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="p-10 flex flex-col gap-4 max-w-sm">
      <input
        className="border p-2"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <input
        className="border p-2"
        placeholder="Código de sala"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white p-2"
        onClick={() => createRoom(nickname)}
      >
        Crear Sala
      </button>
      <button
        className="border border-blue-600 text-blue-600 p-2"
        onClick={() => joinRoom(roomCode, nickname)}
      >
        Unirse
      </button>
    </main>
  );
}
