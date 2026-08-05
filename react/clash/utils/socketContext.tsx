"use client";

import { createContext, useCallback, useContext, useRef } from "react";

// Messages the game backend broadcasts over the WebSocket (`/ws`). The server
// uses upper-case type tags for gameplay, plus a lower-case "join" ack.
export type GameMessage =
  | { type: "join"; code: number; msg: string }
  | { type: "READY"; code: number; count: number; total: number }
  | { type: "CLICK"; code: number; index: number; color: string }
  | { type: "STOP"; code: number; name: string }
  | { type: "ERROR"; code: number; msg: string };

type SocketContextValue = {
  // Open the socket (if needed) and JOIN the game's room. Resolves once JOIN
  // has been sent.
  connect: (gameId: string) => Promise<void>;
  sendClick: (gameId: string, index: number, color: string) => void;
  sendStop: (gameId: string, name: string) => void;
  // Subscribe to every inbound message; returns an unsubscribe fn.
  subscribe: (callback: (msg: GameMessage) => void) => () => void;
  disconnect: () => void;
};

const SocketContext = createContext<SocketContextValue | null>(null);

// Derive the WS URL from the SAME host as the HTTP API (NEXT_PUBLIC_API_URL),
// so the socket can never drift to a different/unreachable host than the
// working /create, /join and SSE calls. http(s) -> ws(s), targeting `/ws`.
const wsBase = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
  .replace(/^http/, "ws")
  .replace(/\/+$/, "");
const WS_URL = wsBase.endsWith("/ws") ? wsBase : `${wsBase}/ws`;

function waitForOpen(socket: WebSocket) {
  return new Promise<void>((resolve, reject) => {
    if (socket.readyState === WebSocket.OPEN) {
      resolve();
      return;
    }
    socket.addEventListener("open", () => resolve(), { once: true });
    socket.addEventListener(
      "error",
      () => reject(new Error("WebSocket connection failed")),
      { once: true },
    );
  });
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef(new Set<(msg: GameMessage) => void>());

  const getSocket = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
      return socketRef.current;
    }
    const socket = new WebSocket(WS_URL);
    socket.onmessage = (event) => {
      let msg: GameMessage;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }
      listenersRef.current.forEach((listener) => listener(msg));
    };
    socketRef.current = socket;
    return socket;
  }, []);

  const connect = useCallback(
    async (gameId: string) => {
      const socket = getSocket();
      await waitForOpen(socket);
      socket.send(JSON.stringify({ type: "JOIN", gameId }));
    },
    [getSocket],
  );

  const sendClick = useCallback(
    (gameId: string, index: number, color: string) => {
      const socket = socketRef.current;
      if (!socket || socket.readyState !== WebSocket.OPEN) return;
      socket.send(JSON.stringify({ type: "CLICK", gameId, index, color }));
    },
    [],
  );

  const sendStop = useCallback((gameId: string, name: string) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: "STOP", gameId, name }));
  }, []);

  const subscribe = useCallback((callback: (msg: GameMessage) => void) => {
    listenersRef.current.add(callback);
    return () => {
      listenersRef.current.delete(callback);
    };
  }, []);

  const disconnect = useCallback(() => {
    socketRef.current?.close();
    socketRef.current = null;
  }, []);

  return (
    <SocketContext.Provider
      value={{ connect, sendClick, sendStop, subscribe, disconnect }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return ctx;
}
