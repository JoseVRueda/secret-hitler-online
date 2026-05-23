import type { Player } from "./player.js";

export type Room = {
  code: string;
  players: Player[];
};
