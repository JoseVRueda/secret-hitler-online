export type {
  ElectionResult,
  ExecutivePower,
  GameContext,
  GamePhase,
  GameState,
  Policy,
  PrivatePlayerView,
  PublicGameState,
  PublicPlayerRole,
  Vote,
  VoteValue,
  WinInfo,
  WinReason,
} from "./game.js";
export const AVATAR_COUNT = 20;

export type { Player, PlayerRole, PublicPlayer } from "./player.js";
export type { PublicRoom, Room } from "./room.js";
export type {
  AcknowledgePeekPayload,
  AcknowledgeRolePayload,
  CastVotePayload,
  ChancellorEnactPayload,
  ClientToServerEvents,
  ConfirmVetoPayload,
  ExecutiveActionPayload,
  JoinRoomPayload,
  PresidentDiscardPayload,
  RequestVetoPayload,
  SelectAvatarPayload,
  SelectChancellorPayload,
  ServerToClientEvents,
} from "./socketEvents.js";
