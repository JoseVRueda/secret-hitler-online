import type { PublicRoom } from "@secret-hitler/shared";
import { GamePhaseView } from "../game/GamePhaseView";
import { PolicyBoard } from "../game/PolicyBoard";
import Panel from "../ui/Panel";
import Stamp from "../ui/Stamp";

interface RoomProps {
  room: PublicRoom;
}

export default function Room(props: RoomProps) {
  const { room } = props;

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <Panel
        className="text-center"
        stamp={
          <Stamp color="gold" className="text-base sm:text-lg">
            {room.code}
          </Stamp>
        }
      >
        <h1 className="font-poster text-3xl uppercase tracking-wide sm:text-4xl">
          Secret Hitler
        </h1>
        <p className="mt-1 font-stamp text-xs uppercase tracking-[0.25em] text-ink/60">
          Sala de espera
        </p>
      </Panel>

      <Panel title={`Jugadores (${room.players.length})`}>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {room.players.map((player) => (
            <li
              key={player.socketId}
              className="deco-frame relative flex items-center justify-center bg-parchment-dark/50 px-3 py-5 text-center shadow-[2px_2px_0_0_var(--color-ink)]"
            >
              {player.isHost && (
                <Stamp
                  color="gold"
                  className="absolute -top-3 -right-3 text-[0.65rem]"
                >
                  Host
                </Stamp>
              )}
              <span className="font-stamp text-sm uppercase tracking-wide text-ink">
                {player.nickname}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <PolicyBoard />
        <GamePhaseView roomCode={room.code} />
      </div>
    </main>
  );
}
