import { assignRoles } from "@/game/assignRoles.js";
import { emitGameState } from "@/game/emitGameState.js";
import { createGame, getGame } from "@/game/gameService.js";
import { getPrivateGameView } from "@/game/privateGameView.js";
import { getPresidentSocketId } from "@/game/selectPresident.js";
import { generateRoomCode } from "@/utils/generateRoomCode.js";
import type {
  ClientToServerEvents,
  JoinRoomPayload,
  Room,
  ServerToClientEvents,
} from "@secret-hitler/shared";
import { Server, Socket } from "socket.io";
import { rooms } from "./roomStore.js";
import { toPublicRoom } from "./toPublicRoom.js";

export function handleCreateRoom(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  nickname: string,
) {
  const code = generateRoomCode();

  const room: Room = {
    code,
    players: [
      {
        socketId: socket.id,
        nickname,
        isHost: true,
      },
    ],
  };

  rooms.set(code, room);

  createGame(code);

  socket.join(code);

  io.to(code).emit("room-updated", room);
}

export function handleJoinRoom(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  data: JoinRoomPayload,
) {
  const room = rooms.get(data.code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  room.players.push({
    socketId: socket.id,
    nickname: data.nickname,
    isHost: false,
  });

  socket.join(data.code);

  io.to(data.code).emit("room-updated", room);
}

export function handleStartGame(io: Server, socket: Socket, code: string) {
  const room = rooms.get(code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  const player = room.players.find((p) => p.socketId === socket.id);

  if (!player?.isHost) {
    socket.emit("error-message", "Solo el host puede iniciar la partida");
    return;
  }

  if (room.players.length < 5) {
    socket.emit("error-message", "Se necesitan mínimo 5 jugadores");
    return;
  }

  if (room.players.length > 10) {
    socket.emit("error-message", "Máximo 10 jugadores");
    return;
  }

  const game = getGame(code);

  if (!game) {
    socket.emit("error-message", "Juego no encontrado");
    return;
  }

  room.players = assignRoles(room.players);

  game.send({ type: "START_GAME" });

  const snapshot = game.getSnapshot();

  const presidentSocketId = getPresidentSocketId(
    room,
    snapshot.context.presidentIndex,
  );

  game.send({
    type: "PRESIDENT_SELECTED",
    presidentSocketId,
  });

  io.to(code).emit("room-updated", toPublicRoom(room));

  for (const player of room.players) {
    io.to(player.socketId).emit(
      "private-game-updated",
      getPrivateGameView(player, room.players),
    );
  }

  emitGameState(io, code, game);
}

export function handleSelectChancellor(
  io: Server,
  socket: Socket,
  data: {
    code: string;
    chancellorSocketId: string;
  },
) {
  const room = rooms.get(data.code);

  if (!room) {
    socket.emit("error-message", "Sala no encontrada");
    return;
  }

  const game = getGame(data.code);

  if (!game) {
    socket.emit("error-message", "Juego no encontrado");
    return;
  }

  const snapshot = game.getSnapshot();
  const context = snapshot.context;

  if (snapshot.value !== "chancellorSelection") {
    socket.emit("error-message", "No es momento de elegir canciller");
    return;
  }

  if (context.presidentSocketId !== socket.id) {
    socket.emit("error-message", "Solo el presidente puede elegir canciller");
    return;
  }

  if (data.chancellorSocketId === context.presidentSocketId) {
    socket.emit("error-message", "El presidente no puede ser canciller");
    return;
  }

  const candidate = room.players.find(
    (player) => player.socketId === data.chancellorSocketId,
  );

  if (!candidate) {
    socket.emit("error-message", "Jugador no encontrado");
    return;
  }

  game.send({
    type: "CHANCELLOR_SELECTED",
    chancellorSocketId: data.chancellorSocketId,
  });

  emitGameState(io, data.code, game);
}
