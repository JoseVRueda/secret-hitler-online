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
      <button
        className="bg-blue-600 text-white p-2"
        onClick={() => createRoom(nickname)}
      >
        Crear Sala
      </button>
      <button
        className="border border-blue-600 text-blue-600 p-2"
        onClick={() => joinRoom(roomCode, nickname)}
      >
        Unirse
      </button>
    </main>
  );
}
