import { Room } from "./room";

export type Store = {
  room: Room | null;
  setRoom: (room: Room) => void;
};
