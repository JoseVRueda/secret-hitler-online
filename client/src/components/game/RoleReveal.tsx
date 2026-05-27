"use client";

import { socket } from "@/lib/socket";
import { acknowledgeRole } from "@/services/gameService";
import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";
import Button from "../ui/Button";

export function RoleReveal() {
  const room = useRoomStore((s) => s.room);
  const game = useGameStore((s) => s.game);
  const privatePlayer = useGameStore((s) => s.privatePlayer);

  if (!room || !game || game.phase !== "roleAssignment") return null;
  if (!privatePlayer?.role) return null;

  const hasAcknowledged = game.context.rolesAcknowledgedBy.includes(
    socket.id ?? "",
  );
  const acknowledgedCount = game.context.rolesAcknowledgedBy.length;
  const totalPlayers = room.players.length;

  return (
    <section className="rounded-xl border p-6">
      <h2 className="text-2xl font-bold">Tu rol secreto</h2>
      <p className="mt-4 text-xl">
        {privatePlayer.role === "liberal" && "🕊️ Liberal"}
        {privatePlayer.role === "fascist" && "🟥 Fascista"}
        {privatePlayer.role === "hitler" && "☠️ Hitler"}
      </p>
      {privatePlayer.knownPlayers.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold">Jugadores que conoces:</h3>

          {privatePlayer.knownPlayers.map((p) => (
            <p key={p.socketId}>
              {p.nickname} — {p.role}
            </p>
          ))}
        </div>
      )}
      <div className="mt-6">
        {!hasAcknowledged ? (
          <Button onClick={() => acknowledgeRole(room.code)}>
            He leído mi rol — continuar
          </Button>
        ) : (
          <p className="text-sm opacity-70">
            Esperando al resto de jugadores ({acknowledgedCount}/{totalPlayers})
          </p>
        )}
      </div>
    </section>
  );
}
