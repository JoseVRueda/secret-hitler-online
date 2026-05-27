import type {
  GameState,
  PrivatePlayerView,
  PublicPlayer,
  PublicRoom,
} from "@secret-hitler/shared";

export type RoomStore = {
  room: PublicRoom | null;
  setRoom: (room: PublicRoom) => void;
  getCurrentPlayer: (socketId: string) => PublicPlayer | undefined;
};

export type GameStore = {
  game: GameState | null;
  privatePlayer: PrivatePlayerView | null;
  setGame: (game: GameState) => void;
  setPrivatePlayer: (player: PrivatePlayerView) => void;
};
