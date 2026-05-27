import type { GameState, PrivatePlayerView } from "./game.js";
import type { PublicRoom } from "./room.js";

export type JoinRoomPayload = {
  code: string;
  nickname: string;
};

export type SelectChancellorPayload = {
  code: string;
  chancellorSocketId: string;
};

export type AcknowledgeRolePayload = {
  code: string;
};

export type ClientToServerEvents = {
  "create-room": (nickname: string) => void;
  "join-room": (data: JoinRoomPayload) => void;
  "start-game": (code: string) => void;
  "acknowledge-role": (data: AcknowledgeRolePayload) => void;
  "select-chancellor": (data: SelectChancellorPayload) => void;
};

export type ServerToClientEvents = {
  "room-updated": (room: PublicRoom) => void;
  "error-message": (message: string) => void;
  "game-updated": (game: GameState) => void;
  "private-game-updated": (player: PrivatePlayerView) => void;
};
