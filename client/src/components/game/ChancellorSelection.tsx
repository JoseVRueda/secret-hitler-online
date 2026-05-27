"use client";

import { socket } from "@/lib/socket";
import { selectChancellor } from "@/services/gameService";
import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";

export function ChancellorSelection() {
  const room = useRoomStore((s) => s.room);
  const game = useGameStore((s) => s.game);

  if (!room || !game) return null;

  const isPresident = game.context.presidentSocketId === socket.id;

  if (game.phase !== "chancellorSelection") return null;

  const president = room.players.find(
    (p) => p.socketId === game.context.presidentSocketId,
  );

  const candidates = room.players.filter(
    (p) => p.socketId !== game.context.presidentSocketId,
  );

  return (
    <section className="rounded-xl border p-6">
      <h2 className="text-xl font-bold">Selección de canciller</h2>
      <p className="mt-2">
        Presidente actual:{" "}
        <strong>{president?.nickname ?? "Desconocido"}</strong>
      </p>
      {!isPresident && (
        <p className="mt-4 text-sm opacity-70">
          Esperando a que el presidente elija canciller...
        </p>
      )}
      {isPresident && (
        <div className="mt-4 flex flex-col gap-2">
          {candidates.map((player) => (
            <button
              key={player.socketId}
              className="rounded border px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => selectChancellor(room.code, player.socketId)}
            >
              Nominar a {player.nickname}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
