import Button from "../ui/Button";

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
    <main className="p-10 flex flex-col gap-4 max-w-sm">
      <input
        className="border p-2"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <input
        className="border p-2"
        placeholder="Código de sala"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <Button onClick={() => createRoom(nickname)}>Crear Sala</Button>
      <Button onClick={() => joinRoom(roomCode, nickname)} variant="outlined">
        Unirse
      </Button>
    </main>
  );
}
