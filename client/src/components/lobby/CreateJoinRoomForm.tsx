import Button from "../ui/Button";
import Panel from "../ui/Panel";
import TextInput from "../ui/TextInput";

interface JoinRoomFormProps {
  nickname: string;
  setNickname: (nickname: string) => void;
  roomCode: string;
  setRoomCode: (roomCode: string) => void;
  createRoom: (nickname: string) => void;
  joinRoom: (roomCode: string, nickname: string) => void;
}

export default function JoinRoomForm(props: JoinRoomFormProps) {
  const { nickname, setNickname, roomCode, setRoomCode, createRoom, joinRoom } =
    props;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="text-center">
        <h1 className="font-poster text-5xl uppercase tracking-[0.06em] text-parchment drop-shadow-[3px_3px_0_var(--color-blood)] sm:text-6xl">
          Secret Hitler
        </h1>
        <p className="mt-3 font-stamp text-xs uppercase tracking-[0.3em] text-brass sm:text-sm">
          Intriga y engaño en la Alemania de entreguerras
        </p>
      </div>

      <Panel title="Únete a la partida" className="w-full max-w-sm">
        <div className="flex flex-col gap-5">
          <TextInput
            label="Tu nombre en clave"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <Button className="w-full" onClick={() => createRoom(nickname)}>
            Crear sala
          </Button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-ink/25" />
            <span className="font-stamp text-xs uppercase tracking-[0.2em] text-ink/50">
              o
            </span>
            <span className="h-px flex-1 bg-ink/25" />
          </div>

          <TextInput
            label="Código de sala"
            placeholder="ABCD"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={() => joinRoom(roomCode, nickname)}
            color="secondary"
            variant="outlined"
          >
            Unirse
          </Button>
        </div>
      </Panel>
    </main>
  );
}
