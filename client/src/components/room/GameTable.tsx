"use client";

import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import { getEligibleChancellorIds } from "@/lib/eligibility";
import { executiveAction, selectChancellor } from "@/services/gameService";
import { useGameStore } from "@/store/useGameStore";
import type { PlayerRole, PublicRoom } from "@secret-hitler/shared";
import { Boards } from "../game/Boards";
import { GamePhaseView } from "../game/GamePhaseView";
import { InvestigationReveal } from "../game/InvestigationReveal";
import PlayerRow from "../player/PlayerRow";
import type { PlayerMarker } from "../player/PlayerCard";
import Credits from "../ui/Credits";
import RoomHeader from "./RoomHeader";

interface GameTableProps {
  room: PublicRoom;
}

export default function GameTable(props: GameTableProps) {
  const { room } = props;
  const game = useGameStore((state) => state.game);
  const privatePlayer = useGameStore((state) => state.privatePlayer);
  const currentPlayer = useCurrentPlayer();

  if (!game) return null;

  const isPresident = game.presidentSocketId === currentPlayer?.socketId;
  const roles: Partial<Record<string, PlayerRole>> = {};

  if (game.phase === "gameOver" && game.roles) {
    for (const entry of game.roles) {
      roles[entry.socketId] = entry.role;
    }
  } else if (game.phase !== "roleAssignment") {
    if (currentPlayer && privatePlayer?.role) {
      roles[currentPlayer.socketId] = privatePlayer.role;
    }

    for (const known of privatePlayer?.knownPlayers ?? []) {
      if (known.role) {
        roles[known.socketId] = known.role;
      }
    }
  }

  const markers: Partial<Record<string, PlayerMarker>> = {};

  if (game.phase === "voting") {
    for (const socketId of game.playerSocketIds) {
      if (game.deadPlayerSocketIds.includes(socketId)) continue;
      if (!game.hasVotedSocketIds.includes(socketId)) {
        markers[socketId] = "busy";
      }
    }
  } else if (game.lastElection) {
    for (const vote of game.lastElection.votes) {
      markers[vote.socketId] = vote.vote;
    }
  }

  let selectableSocketIds: string[] | undefined;
  let onSelect: ((socketId: string) => void) | undefined;

  if (game.phase === "chancellorSelection" && isPresident) {
    selectableSocketIds = getEligibleChancellorIds(game);
    onSelect = (socketId) => selectChancellor(room.code, socketId);
  }

  if (
    game.phase === "executiveAction" &&
    isPresident &&
    game.pendingPower &&
    game.pendingPower !== "policyPeek"
  ) {
    selectableSocketIds = room.players
      .filter((player) => {
        if (player.socketId === game.presidentSocketId) return false;
        if (game.deadPlayerSocketIds.includes(player.socketId)) return false;
        if (
          game.pendingPower === "investigateLoyalty" &&
          game.investigatedSocketIds.includes(player.socketId)
        ) {
          return false;
        }
        return true;
      })
      .map((player) => player.socketId);
    onSelect = (socketId) => executiveAction(room.code, socketId);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6">
      <RoomHeader code={room.code} round={game.round} />
      <PlayerRow
        players={room.players}
        presidentSocketId={game.presidentSocketId}
        chancellorSocketId={game.chancellorSocketId}
        deadSocketIds={game.deadPlayerSocketIds}
        roles={roles}
        markers={markers}
        selectableSocketIds={selectableSocketIds}
        onSelect={onSelect}
      />
      <Boards />
      <div className="mx-auto w-full max-w-3xl">
        <GamePhaseView roomCode={room.code} />
      </div>
      <InvestigationReveal />
      <Credits />
    </main>
  );
}
