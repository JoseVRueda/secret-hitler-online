import { socket } from "@/lib/socket";

export function startGame(roomCode: string) {
  socket.emit("start-game", roomCode);
}
