"use client";

import { useCurrentPlayer } from "@/hooks/useCurrentPlayer";
import type { PublicRoom } from "@secret-hitler/shared";
import AvatarPicker from "../lobby/AvatarPicker";
import PlayerRow from "../player/PlayerRow";
import Credits from "../ui/Credits";
import Panel from "../ui/Panel";
import RoomHeader from "./RoomHeader";
import { StartGameButton } from "./StartGameButton";

interface LobbyViewProps {
  room: PublicRoom;
}

export default function LobbyView(props: LobbyViewProps) {
  const { room } = props;
  const currentPlayer = useCurrentPlayer();
  const playerCount = room.players.length;

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-8">
      <RoomHeader code={room.code} subtitle="Sala de espera" />

      <Panel title={`Jugadores (${playerCount}/10)`}>
        <PlayerRow players={room.players} />
      </Panel>

      <Panel title="Elige tu retrato">
        <AvatarPicker room={room} currentAvatar={currentPlayer?.avatar} />
      </Panel>

      <div className="flex flex-col items-center gap-3">
        <StartGameButton roomCode={room.code} />
        {!currentPlayer?.isHost && (
          <p className="font-body text-sm text-muted">
            Esperando a que el anfitrión inicie la partida.
          </p>
        )}
        {currentPlayer?.isHost && playerCount < 5 && (
          <p className="font-body text-sm text-muted">
            Hacen falta al menos 5 jugadores ({playerCount}/5).
          </p>
        )}
      </div>

      <Credits />
    </main>
  );
}
