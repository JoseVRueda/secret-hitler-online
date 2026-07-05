"use client";

import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { castVote } from "@/services/gameService";
import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";
import Button from "../ui/Button";

export function VotingBooth() {
  const room = useRoomStore((s) => s.room);
  const game = useGameStore((s) => s.game);
  const currentPlayer = useCurrentPlayer();

  if (!room || !game) return null;

  const isAlive =
    currentPlayer &&
    !game.deadPlayerSocketIds.includes(currentPlayer.socketId);
  const hasVoted = game.hasVotedSocketIds.includes(
    currentPlayer?.socketId ?? "",
  );
  const canVote = isAlive && !hasVoted;

  const president = room.players.find(
    (p) => p.socketId === game.presidentSocketId,
  );
  const chancellor = room.players.find(
    (p) => p.socketId === game.chancellorSocketId,
  );

  const voters = game.hasVotedSocketIds
    .map((id) => room.players.find((p) => p.socketId === id)?.nickname)
    .filter(Boolean);

  const lastElection = game.lastElection;

  return (
    <section className="rounded-xl border p-6">
      <h2 className="text-xl font-bold">Votación del gobierno</h2>
      <p className="mt-2">
        Gobierno propuesto:{" "}
        <strong>{president?.nickname ?? "?"}</strong> (presidente) +{" "}
        <strong>{chancellor?.nickname ?? "?"}</strong> (canciller)
      </p>

      {canVote && (
        <div className="mt-6 flex gap-4">
          <Button onClick={() => castVote(room.code, "ja")}>Ja ✓</Button>
          <Button
            onClick={() => castVote(room.code, "nein")}
            color="secondary"
          >
            Nein ✗
          </Button>
        </div>
      )}

      {!isAlive && (
        <p className="mt-4 text-sm opacity-70">
          Has sido eliminado y no puedes votar.
        </p>
      )}

      {isAlive && hasVoted && (
        <p className="mt-4 text-sm opacity-70">
          Ya has votado. Esperando al resto...
        </p>
      )}

      {voters.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium">
            Han votado ({voters.length}):
          </p>
          <p className="mt-1 text-sm opacity-70">{voters.join(", ")}</p>
        </div>
      )}

      {lastElection && game.phase !== "voting" && (
        <div className="mt-6 rounded-lg border border-dashed p-4">
          <p className="font-medium">Resultado de la última elección</p>
          <p className="mt-2 text-sm">
            {lastElection.passed ? (
              <span className="text-green-400">Gobierno electo</span>
            ) : (
              <span className="text-red-400">Gobierno rechazado</span>
            )}
          </p>
          <p className="mt-2 text-xs opacity-60">
            Votos: {lastElection.votes.filter((v) => v.vote === "ja").length}{" "}
            Ja /{" "}
            {lastElection.votes.filter((v) => v.vote === "nein").length} Nein
          </p>
        </div>
      )}
    </section>
  );
}
