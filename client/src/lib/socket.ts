import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@secret-hitler/shared";
import { io, type Socket } from "socket.io-client";
import { env } from "./env";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  env.serverUrl,
);
