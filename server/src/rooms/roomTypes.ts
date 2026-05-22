export type Player = {
  socketId: string;
  nickname: string;
  isHost: boolean;
};

export type Room = {
  code: string;
  players: Player[];
};
