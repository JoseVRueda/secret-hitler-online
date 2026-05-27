import { socket } from "@/lib/socket";
import { useRoomStore } from "@/store/useRoomStore";
import type { PublicRoom } from "@secret-hitler/shared";

export function registerRoomSocketEvents() {
  const onRoomUpdated = (room: PublicRoom) => {
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
