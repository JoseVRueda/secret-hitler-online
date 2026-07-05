import type { Policy, VoteValue } from "@secret-hitler/shared";
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

export function castVote(code: string, vote: VoteValue) {
  socket.emit("cast-vote", { code, vote });
}

export function presidentDiscard(code: string, policy: Policy) {
  socket.emit("president-discard", { code, policy });
}

export function chancellorEnact(code: string, policy: Policy) {
  socket.emit("chancellor-enact", { code, policy });
}

export function requestVeto(code: string) {
  socket.emit("request-veto", { code });
}

export function confirmVeto(code: string, agree: boolean) {
  socket.emit("confirm-veto", { code, agree });
}

export function executiveAction(code: string, targetSocketId?: string) {
  socket.emit("executive-action", { code, targetSocketId });
}

export function acknowledgePeek(code: string) {
  socket.emit("acknowledge-peek", { code });
}
