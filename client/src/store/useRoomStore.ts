import { Store } from "@/types/store";
import { create } from "zustand";

export const useRoomStore = create<Store>((set) => ({
  room: null,
  setRoom: (room) => set({ room }),
}));
