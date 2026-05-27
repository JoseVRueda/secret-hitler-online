import type { Room } from "@secret-hitler/shared";

export function getPresidentSocketId(
  room: Room,
  presidentIndex: number,
): string {
  const index = presidentIndex % room.players.length;

  return room.players[index]?.socketId ?? "";
}
