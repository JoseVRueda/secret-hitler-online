import type { PlayerRole, PublicPlayer } from "./player.js";

export type GamePhase =
  | "lobby"
  | "roleAssignment"
  | "presidentSelection"
  | "chancellorSelection"
  | "voting"
  | "legislativeSession"
  | "executiveAction"
  | "gameOver";

export type GameContext = {
  roomCode: string;
  round: number;
  presidentSocketId: string | null;
  chancellorSocketId: string | null;
  presidentIndex: number;
};

export type GameState = {
  phase: GamePhase;
  context: GameContext;
};

export type KnownPlayer = {
  socketId: string;
  nickname: string;
  role?: PlayerRole | "fascist";
};

export type PrivatePlayerView = {
  role?: PlayerRole;
  knownPlayers: PublicPlayer[];
};
