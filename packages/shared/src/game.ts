import type { PlayerRole } from "./player.js";

export type GamePhase =
  | "lobby"
  | "roleAssignment"
  | "chancellorSelection"
  | "voting"
  | "legislativeSession"
  | "gameOver";

export type GameContext = {
  roomCode: string;
  round: number;
  presidentSocketId: string | null;
  chancellorSocketId: string | null;
  presidentIndex: number;
  rolesAcknowledgedBy: string[];
};

export type GameState = {
  phase: GamePhase;
  context: GameContext;
};

export type PrivatePlayerView = {
  role?: PlayerRole;
  knownPlayers: Array<{
    socketId: string;
    nickname: string;
    role?: PlayerRole;
  }>;
};
