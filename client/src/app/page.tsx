"use client";

import { socket } from "@/lib/socket";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const onConnect = () => {
      console.log("Conectado:", socket.id);
    };

    socket.on("connect", onConnect);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">Secret Hitler Online</h1>
    </main>
  );
}
