import { socket } from "@/lib/socket";

export function createRoom(nickname: string) {
  socket.emit("create-room", nickname);
}

export function joinRoom(roomCode: string, nickname: string) {
  socket.emit("join-room", {
    code: roomCode,
    nickname,
  });
}

export function selectAvatar(roomCode: string, avatar: number) {
  socket.emit("select-avatar", {
    code: roomCode,
    avatar,
  });
}
