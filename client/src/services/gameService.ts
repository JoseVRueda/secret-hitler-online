import { socket } from "@/lib/socket";

export function startGame(roomCode: string) {
  socket.emit("start-game", roomCode);
}

export function acknowledgeRole(code: string) {
  socket.emit("acknowledge-role", { code });
}

export function selectChancellor(code: string, chancellorSocketId: string) {
  socket.emit("select-chancellor", {
    code,
    chancellorSocketId,
  });
}
