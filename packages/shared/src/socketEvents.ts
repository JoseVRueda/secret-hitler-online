import type { GameState, PrivatePlayerView } from "./game.js";
import type { PublicRoom } from "./room.js";

export type JoinRoomPayload = {
  code: string;
  nickname: string;
};

export type ClientToServerEvents = {
  "create-room": (nickname: string) => void;
  "join-room": (data: JoinRoomPayload) => void;
  "start-game": (code: string) => void;
};

export type ServerToClientEvents = {
  "room-updated": (room: PublicRoom) => void;
  "error-message": (message: string) => void;
  "game-updated": (game: GameState) => void;
  "private-game-updated": (player: PrivatePlayerView) => void;
};
