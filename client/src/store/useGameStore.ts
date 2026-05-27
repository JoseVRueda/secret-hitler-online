import { GameStore } from "@/types/store";
import { create } from "zustand";

export const useGameStore = create<GameStore>((set) => ({
  game: null,
  privatePlayer: null,

  setGame: (game) => set({ game }),
  setPrivatePlayer: (player) => set({ privatePlayer: player }),
}));
