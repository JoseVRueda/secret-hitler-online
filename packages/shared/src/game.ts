import type { PlayerRole } from "./player.js";

export type GamePhase =
  | "lobby"
  | "roleAssignment"
  | "chancellorSelection"
  | "voting"
  | "presidentLegislative"
  | "chancellorEnact"
  | "executiveAction"
  | "gameOver";

export type VoteValue = "ja" | "nein";

export type Vote = {
  socketId: string;
  vote: VoteValue;
};

export type Policy = "liberal" | "fascist";

export type ExecutivePower =
  | "investigateLoyalty"
  | "specialElection"
  | "policyPeek"
  | "execution";

export type WinReason =
  | "liberalPolicies"
  | "fascistPolicies"
  | "hitlerElected"
  | "hitlerExecuted";

export type WinInfo = {
  winner: "liberal" | "fascist";
  reason: WinReason;
};

export type ElectionResult = {
  presidentSocketId: string;
  chancellorSocketId: string;
  votes: Vote[];
  passed: boolean;
};

export type GameContext = {
  roomCode: string;
  round: number;
  presidentSocketId: string | null;
  chancellorSocketId: string | null;
  presidentIndex: number;
  playerSocketIds: string[];
  rolesAcknowledgedBy: string[];
  votes: Vote[];
  policyDeck: Policy[];
  discardPile: Policy[];
  liberalPolicies: number;
  fascistPolicies: number;
  electionTracker: number;
  presidentDraw: Policy[];
  chancellorDraw: Policy[];
  lastPresidentSocketId: string | null;
  lastChancellorSocketId: string | null;
  deadPlayerSocketIds: string[];
  investigatedSocketIds: string[];
  pendingPower: ExecutivePower | null;
  specialElectionReturnIndex: number | null;
  vetoRequested: boolean;
  winInfo: WinInfo | null;
  lastElection: ElectionResult | null;
  playerRoles: Record<string, PlayerRole>;
  policyPeek: Policy[];
  investigationResults: Record<
    string,
    { targetSocketId: string; party: "liberal" | "fascist" }
  >;
};

export type GameState = {
  phase: GamePhase;
  context: GameContext;
};

export type PublicPlayerRole = {
  socketId: string;
  role: PlayerRole;
};

export type PublicGameState = {
  phase: GamePhase;
  roomCode: string;
  round: number;
  presidentSocketId: string | null;
  chancellorSocketId: string | null;
  presidentIndex: number;
  playerSocketIds: string[];
  rolesAcknowledgedBy: string[];
  liberalPolicies: number;
  fascistPolicies: number;
  electionTracker: number;
  deckSize: number;
  discardSize: number;
  lastPresidentSocketId: string | null;
  lastChancellorSocketId: string | null;
  deadPlayerSocketIds: string[];
  investigatedSocketIds: string[];
  hasVotedSocketIds: string[];
  pendingPower: ExecutivePower | null;
  vetoRequested: boolean;
  vetoUnlocked: boolean;
  lastElection: ElectionResult | null;
  winInfo: WinInfo | null;
  roles: PublicPlayerRole[] | null;
};

export type PrivatePlayerView = {
  role?: PlayerRole;
  knownPlayers: Array<{
    socketId: string;
    nickname: string;
    role?: PlayerRole;
  }>;
  policiesToAct?: Policy[];
  policyPeek?: Policy[];
  investigationResult?: {
    nickname: string;
    party: "liberal" | "fascist";
  };
};
