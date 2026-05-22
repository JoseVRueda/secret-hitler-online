import { socket } from "@/lib/socket";
import { useRoomStore } from "@/store/useRoomStore";

export function registerRoomSocketEvents() {
  socket.on("room-updated", (room) => {
    useRoomStore.getState().setRoom(room);
  });

  socket.on("error-message", (message) => {
    alert(message);
  });
}
