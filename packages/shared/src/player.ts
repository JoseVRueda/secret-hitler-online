export type PlayerRole = "liberal" | "fascist" | "hitler";

export type Player = {
  socketId: string;
  nickname: string;
  isHost: boolean;
  avatar: number;
  role?: PlayerRole;
};

export type PublicPlayer = {
  socketId: string;
  nickname: string;
  isHost: boolean;
  avatar: number;
};
