"use client";

import type { PlayerRole, PublicPlayer } from "@secret-hitler/shared";
import PlayerCard, { type PlayerMarker } from "./PlayerCard";

interface PlayerRowProps {
  players: PublicPlayer[];
  presidentSocketId?: string | null;
  chancellorSocketId?: string | null;
  deadSocketIds?: string[];
  roles?: Partial<Record<string, PlayerRole>>;
  markers?: Partial<Record<string, PlayerMarker>>;
  selectableSocketIds?: string[];
  onSelect?: (socketId: string) => void;
}

export default function PlayerRow(props: PlayerRowProps) {
  const {
    players,
    presidentSocketId = null,
    chancellorSocketId = null,
    deadSocketIds = [],
    roles = {},
    markers = {},
    selectableSocketIds,
    onSelect,
  } = props;

  const selecting = Boolean(onSelect);
  const selectable = new Set(selectableSocketIds ?? []);
  const dead = new Set(deadSocketIds);

  return (
    <ul className="flex flex-wrap items-end justify-center gap-x-3 gap-y-6 pt-4">
      {players.map((player) => {
        const isDead = dead.has(player.socketId);
        const canSelect =
          selecting && selectable.has(player.socketId) && !isDead;

        return (
          <li key={player.socketId}>
            <PlayerCard
              player={player}
              role={roles[player.socketId]}
              marker={markers[player.socketId]}
              isPresident={player.socketId === presidentSocketId}
              isChancellor={player.socketId === chancellorSocketId}
              dead={isDead}
              selectable={canSelect}
              unavailable={selecting && !canSelect}
              onSelect={
                canSelect && onSelect
                  ? () => onSelect(player.socketId)
                  : undefined
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
