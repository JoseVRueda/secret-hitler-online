import type {
  GameState,
  Player,
  PrivatePlayerView,
  Room,
} from "@secret-hitler/shared";

export type RoomStore = {
  room: Room | null;
  setRoom: (room: Room) => void;
  getCurrentPlayer: (socketId: string) => Player | undefined;
};

export type GameStore = {
  game: GameState | null;
  privatePlayer: PrivatePlayerView | null;

  setGame: (game: GameState) => void;
  setPrivatePlayer: (player: PrivatePlayerView) => void;
};
