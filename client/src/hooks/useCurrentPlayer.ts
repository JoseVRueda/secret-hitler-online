import { socket } from "@/lib/socket";
import { useRoomStore } from "@/store/useRoomStore";

export function useCurrentPlayer() {
  const getCurrentPlayer = useRoomStore((s) => s.getCurrentPlayer);
  const socketId = socket.id ?? "";

  return getCurrentPlayer(socketId);
}
