"use client";

import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";
import type { ExecutivePower } from "@secret-hitler/shared";

const executivePowerLabels: Record<ExecutivePower, string> = {
  investigateLoyalty: "Investigar",
  specialElection: "Elección especial",
  policyPeek: "Ojear",
  execution: "Ejecución",
};

function PolicySlot(props: { type: "liberal" | "fascist"; filled: boolean }) {
  const { type, filled } = props;
  const base =
    type === "liberal"
      ? "border-blue-400 bg-blue-900/40"
      : "border-red-500 bg-red-900/40";
  const filledClass =
    type === "liberal" ? "bg-blue-500" : "bg-red-600";

  return (
    <div
      className={`h-8 w-8 rounded border-2 ${filled ? filledClass : base}`}
      title={type === "liberal" ? "Política liberal" : "Política fascista"}
    />
  );
}

function ElectionTracker(props: { count: number }) {
  const { count } = props;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm opacity-70">Elecciones fallidas:</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-4 w-4 rounded-full border ${
              i < count
                ? "border-yellow-400 bg-yellow-500"
                : "border-gray-600 bg-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function PolicyBoard() {
  const room = useRoomStore((s) => s.room);
  const game = useGameStore((s) => s.game);

  if (!room || !game || game.phase === "lobby") return null;

  const president = room.players.find(
    (p) => p.socketId === game.presidentSocketId,
  );
  const chancellor = room.players.find(
    (p) => p.socketId === game.chancellorSocketId,
  );
  const lastPresident = room.players.find(
    (p) => p.socketId === game.lastPresidentSocketId,
  );
  const lastChancellor = room.players.find(
    (p) => p.socketId === game.lastChancellorSocketId,
  );

  const alivePlayers = room.players.filter(
    (p) => !game.deadPlayerSocketIds.includes(p.socketId),
  );
  const deadPlayers = room.players.filter((p) =>
    game.deadPlayerSocketIds.includes(p.socketId),
  );

  return (
    <section className="rounded-xl border p-6">
      <h2 className="text-lg font-bold">Tablero</h2>

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-blue-300">
          Políticas liberales ({game.liberalPolicies}/5)
        </p>
        <div className="flex gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <PolicySlot
              key={i}
              type="liberal"
              filled={i < game.liberalPolicies}
            />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-red-300">
          Políticas fascistas ({game.fascistPolicies}/6)
        </p>
        <div className="flex gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <PolicySlot
              key={i}
              type="fascist"
              filled={i < game.fascistPolicies}
            />
          ))}
        </div>
        {game.vetoUnlocked && (
          <p className="mt-2 text-xs text-yellow-400">Veto desbloqueado</p>
        )}
      </div>

      <div className="mt-4">
        <ElectionTracker count={game.electionTracker} />
      </div>

      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <p>
          Presidente:{" "}
          <strong>{president?.nickname ?? "—"}</strong>
        </p>
        <p>
          Canciller:{" "}
          <strong>{chancellor?.nickname ?? "—"}</strong>
        </p>
        {(lastPresident || lastChancellor) && (
          <>
            <p className="opacity-70">
              Último presidente: {lastPresident?.nickname ?? "—"}
            </p>
            <p className="opacity-70">
              Último canciller: {lastChancellor?.nickname ?? "—"}
            </p>
          </>
        )}
      </div>

      <div className="mt-4 flex gap-4 text-xs opacity-60">
        <span>Mazo: {game.deckSize}</span>
        <span>Descarte: {game.discardSize}</span>
      </div>

      {game.pendingPower && game.phase === "executiveAction" && (
        <p className="mt-4 text-sm text-yellow-300">
          Poder pendiente: {executivePowerLabels[game.pendingPower]}
        </p>
      )}

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium">Jugadores vivos</p>
        <div className="flex flex-wrap gap-2">
          {alivePlayers.map((p) => (
            <span
              key={p.socketId}
              className="rounded-full border border-green-600 px-3 py-1 text-sm"
            >
              {p.nickname}
              {p.socketId === game.presidentSocketId && " 🎩"}
              {p.socketId === game.chancellorSocketId && " 📜"}
            </span>
          ))}
        </div>
      </div>

      {deadPlayers.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium opacity-70">Eliminados</p>
          <div className="flex flex-wrap gap-2">
            {deadPlayers.map((p) => (
              <span
                key={p.socketId}
                className="rounded-full border border-gray-600 px-3 py-1 text-sm line-through opacity-50"
              >
                {p.nickname}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
