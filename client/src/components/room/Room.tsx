import type { PublicRoom } from "@secret-hitler/shared";
import { GamePhaseView } from "../game/GamePhaseView";
import { PolicyBoard } from "../game/PolicyBoard";

interface RoomProps {
  room: PublicRoom;
}

export default function Room(props: RoomProps) {
  const { room } = props;

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
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PolicyBoard />
        <GamePhaseView roomCode={room.code} />
      </div>
    </main>
  );
}
