// src/hooks/useSeditorSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

type UseSeditorSocketParams = {
  roomId: string;
  onRemoteInit: (content: string) => void;
  onRemoteCodeChange: (content: string) => void;
};

export function useSeditorSocket({
  roomId,
  onRemoteInit,
  onRemoteCodeChange,
}: UseSeditorSocketParams) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.emit("join_room", { roomId });

    socket.on("init", (data: { roomId: string; content: string }) => {
      onRemoteInit(data.content);
    });

    socket.on(
      "code_change",
      (data: { roomId: string; content: string }) => {
        onRemoteCodeChange(data.content);
      }
    );

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, onRemoteInit, onRemoteCodeChange]);

  const sendCodeChange = (content: string) => {
    socketRef.current?.emit("code_change", { roomId, content });
  };

  return { sendCodeChange };
}
