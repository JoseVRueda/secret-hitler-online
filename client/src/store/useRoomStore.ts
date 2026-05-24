import { Store } from "@/types/store";
import { create } from "zustand";

export const useRoomStore = create<Store>((set, get) => ({
  room: null,
  setRoom: (room) => set({ room }),
  getCurrentPlayer: (socketId) => {
    return get().room?.players.find((p) => p.socketId === socketId);
  },
}));
