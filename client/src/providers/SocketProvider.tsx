"use client";

import { registerGameSocketEvents } from "@/sockets/gameSocket";
import { registerRoomSocketEvents } from "@/sockets/roomSocket";
import { useEffect } from "react";

export function SocketProvider() {
  useEffect(() => {
    registerRoomSocketEvents();
    registerGameSocketEvents();
  }, []);

  return null;
}
