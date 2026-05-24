import type { Player, Room } from "@secret-hitler/shared";

export type Store = {
  room: Room | null;
  setRoom: (room: Room) => void;
  getCurrentPlayer: (socketId: string) => Player | undefined;
};
