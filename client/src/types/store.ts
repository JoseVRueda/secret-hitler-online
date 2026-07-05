import type {
  PrivatePlayerView,
  PublicGameState,
  PublicPlayer,
  PublicRoom,
} from "@secret-hitler/shared";

export type RoomStore = {
  room: PublicRoom | null;
  setRoom: (room: PublicRoom) => void;
  getCurrentPlayer: (socketId: string) => PublicPlayer | undefined;
};

export type GameStore = {
  game: PublicGameState | null;
  privatePlayer: PrivatePlayerView | null;
  setGame: (game: PublicGameState) => void;
  setPrivatePlayer: (player: PrivatePlayerView) => void;
};
