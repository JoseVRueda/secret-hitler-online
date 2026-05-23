import { socket } from "@/lib/socket";
import { useRoomStore } from "@/store/useRoomStore";
import type { Room } from "@/types/room";

export function registerRoomSocketEvents() {
  const onRoomUpdated = (room: Room) => {
    useRoomStore.getState().setRoom(room);
  };

  const onErrorMessage = (message: string) => {
    alert(message);
  };

  socket.on("room-updated", onRoomUpdated);
  socket.on("error-message", onErrorMessage);

  return () => {
    socket.off("room-updated", onRoomUpdated);
    socket.off("error-message", onErrorMessage);
  };
}
