"use client";

import { registerGameSocketEvents } from "@/sockets/gameSocket";
import { registerRoomSocketEvents } from "@/sockets/roomSocket";
import { useEffect } from "react";

export function SocketProvider() {
  useEffect(() => {
    const cleanupRoom = registerRoomSocketEvents();
    const cleanupGame = registerGameSocketEvents();

    return () => {
      cleanupRoom();
      cleanupGame();
    };
  }, []);

  return null;
}
