import type { Room } from "./room.js";

export type JoinRoomPayload = {
  code: string;
  nickname: string;
};

export type ClientToServerEvents = {
  "create-room": (nickname: string) => void;
  "join-room": (data: JoinRoomPayload) => void;
};

export type ServerToClientEvents = {
  "room-updated": (room: Room) => void;
  "error-message": (message: string) => void;
};
