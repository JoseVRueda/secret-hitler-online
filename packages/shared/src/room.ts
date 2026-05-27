import type { Player, PublicPlayer } from "./player.js";

export type Room = {
  code: string;
  players: Player[];
};

export type PublicRoom = {
  code: string;
  players: PublicPlayer[];
};
