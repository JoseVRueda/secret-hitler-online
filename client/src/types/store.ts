import type { Room } from "@secret-hitler/shared";

export type Store = {
  room: Room | null;
  setRoom: (room: Room) => void;
};
