import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { env } from "./lib/env.js";
import { registerSocketHandlers } from "./sockets/registerSocketHandlers.js";

const app = express();

app.use(cors({ origin: env.clientUrl }));

const server = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: env.clientUrl,
  },
});

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  registerSocketHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

server.listen(env.serverPort, () => {
  console.log(`Servidor corriendo en el puerto ${env.serverPort}`);
});
