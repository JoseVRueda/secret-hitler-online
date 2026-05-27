import type { PublicRoom, Room } from "@secret-hitler/shared";

export function toPublicRoom(room: Room): PublicRoom {
  return {
    code: room.code,
    players: room.players.map((player) => ({
      socketId: player.socketId,
      nickname: player.nickname,
      isHost: player.isHost,
    })),
  };
}
