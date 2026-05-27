"use client";

import { useGameStore } from "@/store/useGameStore";

export function RoleReveal() {
  const privatePlayer = useGameStore((s) => s.privatePlayer);

  if (!privatePlayer?.role) return null;

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
    </section>
  );
}
