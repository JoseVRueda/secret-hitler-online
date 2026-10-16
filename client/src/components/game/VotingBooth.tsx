"use client";

import voteNo from "@/assets/cards/vote-no.png";
import voteYes from "@/assets/cards/vote-yes.png";
import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { castVote } from "@/services/gameService";
import { useGameStore } from "@/store/useGameStore";
import { useRoomStore } from "@/store/useRoomStore";
import Image from "next/image";
import Panel from "../ui/Panel";

export function VotingBooth() {
  const room = useRoomStore((state) => state.room);
  const game = useGameStore((state) => state.game);
  const currentPlayer = useCurrentPlayer();

  if (!room || !game) return null;

  const isAlive =
    currentPlayer && !game.deadPlayerSocketIds.includes(currentPlayer.socketId);
  const hasVoted = game.hasVotedSocketIds.includes(
    currentPlayer?.socketId ?? "",
  );
  const canVote = Boolean(isAlive && !hasVoted);
  const president = room.players.find(
    (player) => player.socketId === game.presidentSocketId,
  );
  const chancellor = room.players.find(
    (player) => player.socketId === game.chancellorSocketId,
  );
  const aliveCount = room.players.length - game.deadPlayerSocketIds.length;

  return (
    <Panel title="Votación del gobierno">
      <p className="text-center font-body">
        Gobierno propuesto:{" "}
        <strong className="text-cream">{president?.nickname ?? "?"}</strong>{" "}
        como presidente y{" "}
        <strong className="text-cream">{chancellor?.nickname ?? "?"}</strong>{" "}
        como canciller.
      </p>

      {canVote && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => castVote(room.code, "ja")}
            className="transition-transform hover:-translate-y-1"
          >
            <Image src={voteYes} alt="Ja" className="h-auto w-36 sm:w-48" />
          </button>
          <button
            type="button"
            onClick={() => castVote(room.code, "nein")}
            className="transition-transform hover:-translate-y-1"
          >
            <Image src={voteNo} alt="Nein" className="h-auto w-36 sm:w-48" />
          </button>
        </div>
      )}

      {!isAlive && (
        <p className="mt-4 text-center font-body text-sm text-muted">
          Has sido eliminado y no puedes votar.
        </p>
      )}

      {isAlive && hasVoted && (
        <p className="mt-4 text-center font-body text-sm text-muted">
          Ya has votado. Esperando al resto...
        </p>
      )}

      <p className="mt-4 text-center font-body text-sm text-muted">
        Han votado {game.hasVotedSocketIds.length} de {aliveCount}
      </p>
    </Panel>
  );
}
