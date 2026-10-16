import Button from "../ui/Button";
import Credits from "../ui/Credits";
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
        <h1 className="font-display text-6xl leading-none text-fascist sm:text-8xl">
          Secret Hitler
        </h1>
        <span className="mx-auto mt-4 block h-1 w-40 bg-liberal" />
        <p className="mt-4 font-body text-xs font-bold tracking-[0.28em] text-muted uppercase sm:text-sm">
          Intriga y engaño en la Alemania de entreguerras
        </p>
      </div>

      <Panel title="Únete a la partida" className="w-full max-w-sm">
        <div className="flex flex-col gap-5">
          <TextInput
            label="Tu nombre"
            placeholder="Nombre"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
          />

          <Button className="w-full" onClick={() => createRoom(nickname)}>
            Crear sala
          </Button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-muted/25" />
            <span className="font-body text-xs font-bold tracking-[0.2em] text-muted uppercase">
              o
            </span>
            <span className="h-px flex-1 bg-muted/25" />
          </div>

          <TextInput
            label="Código de sala"
            placeholder="ABCD"
            value={roomCode}
            onChange={(event) => setRoomCode(event.target.value)}
          />

          <Button
            className="w-full"
            onClick={() => joinRoom(roomCode, nickname)}
            color="liberal"
          >
            Unirse
          </Button>
        </div>
      </Panel>

      <Credits />
    </main>
  );
}
