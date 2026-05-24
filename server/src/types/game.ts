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
  presidentId: string | null;
  chancellorId: string | null;
};
