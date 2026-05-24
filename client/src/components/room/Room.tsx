import type { Room } from "@secret-hitler/shared";

interface RoomProps {
  room: Room;
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
    </main>
  );
}
