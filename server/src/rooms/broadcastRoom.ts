import type { Room } from "@secret-hitler/shared";
import type { Server } from "socket.io";
import { toPublicRoom } from "./toPublicRoom.js";

export function emitRoomUpdated(io: Server, room: Room) {
  io.to(room.code).emit("room-updated", toPublicRoom(room));
}
