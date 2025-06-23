import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

export interface Message {
  user: string;
  text: string;
}

const SOCKET_URL = typeof window !== "undefined"
  ? process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"
  : "";

export function useChatSocket(username: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [partner, setPartner] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState(true);

  const socketRef = useRef<Socket | null>(null);

  const connectSocket = () => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
    });

    socket.on("paired", ({ roomId, partnerId }) => {
      setRoomId(roomId);
      setPartner(partnerId);
      setIsWaiting(false);
      setMessages([]);
    });

    socket.on("message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("partner_left", () => {
      setPartner(null);
      setIsWaiting(true);
      setMessages((prev) => [
        ...prev,
        { user: "System", text: "Your partner left. Searching for a new one..." },
      ]);

      setTimeout(() => {
        socket.disconnect();
        connectSocket();
      }, 5000);
    });
  };

  useEffect(() => {
    connectSocket();
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim() || !roomId || !socketRef.current) return;
    const newMsg: Message = { user: username, text };
    setMessages((prev) => [...prev, newMsg]);
    socketRef.current.emit("message", { roomId, ...newMsg });
  };

  const skipUser = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    setMessages([]);
    setRoomId(null);
    setPartner(null);
    setIsWaiting(true);
    connectSocket();
  };

  return {
    messages,
    sendMessage,
    isWaiting,
    skipUser,
    partnerId: partner,
    roomId,
  };
}
