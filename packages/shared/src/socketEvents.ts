import type {
  Policy,
  PrivatePlayerView,
  PublicGameState,
  VoteValue,
} from "./game.js";
import type { PublicRoom } from "./room.js";

export type JoinRoomPayload = {
  code: string;
  nickname: string;
};

export type SelectAvatarPayload = {
  code: string;
  avatar: number;
};

export type SelectChancellorPayload = {
  code: string;
  chancellorSocketId: string;
};

export type AcknowledgeRolePayload = {
  code: string;
};

export type CastVotePayload = {
  code: string;
  vote: VoteValue;
};

export type PresidentDiscardPayload = {
  code: string;
  policy: Policy;
};

export type ChancellorEnactPayload = {
  code: string;
  policy: Policy;
};

export type RequestVetoPayload = {
  code: string;
};

export type ConfirmVetoPayload = {
  code: string;
  agree: boolean;
};

export type ExecutiveActionPayload = {
  code: string;
  targetSocketId?: string;
};

export type AcknowledgePeekPayload = {
  code: string;
};

export type ClientToServerEvents = {
  "create-room": (nickname: string) => void;
  "join-room": (data: JoinRoomPayload) => void;
  "select-avatar": (data: SelectAvatarPayload) => void;
  "start-game": (code: string) => void;
  "acknowledge-role": (data: AcknowledgeRolePayload) => void;
  "select-chancellor": (data: SelectChancellorPayload) => void;
  "cast-vote": (data: CastVotePayload) => void;
  "president-discard": (data: PresidentDiscardPayload) => void;
  "chancellor-enact": (data: ChancellorEnactPayload) => void;
  "request-veto": (data: RequestVetoPayload) => void;
  "confirm-veto": (data: ConfirmVetoPayload) => void;
  "executive-action": (data: ExecutiveActionPayload) => void;
  "acknowledge-peek": (data: AcknowledgePeekPayload) => void;
};

export type ServerToClientEvents = {
  "room-updated": (room: PublicRoom) => void;
  "error-message": (message: string) => void;
  "game-updated": (game: PublicGameState) => void;
  "private-game-updated": (player: PrivatePlayerView) => void;
};
