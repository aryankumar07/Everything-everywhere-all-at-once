"use client"

import { createContext, useCallback, useContext, useRef, useState } from "react";

export type CellClickMessage = {
  type: "cellClick";
  index: number;
  color: number[];
};

type SocketContextValue = {
  joinGame: (gameId: string, name: string) => Promise<void>;
  sendCellClick: (gameId: string, index: number, color: number[]) => void;
  subscribeToCellClicks: (callback: (msg: CellClickMessage) => void) => () => void;
  stopGame: (gameId: string, name: string) => void;
  gameStoped: { stoped: boolean, name: string }
};

const SocketContext = createContext<SocketContextValue | null>(null);

// const WS_URL = "wss://clash-1-0-0.onrender.com"
const WS_URL = "ws://localhost:8000/ws"

function waitForOpen(socket: WebSocket) {
  return new Promise<void>((resolve, reject) => {
    if (socket.readyState === WebSocket.OPEN) {
      resolve();
      return;
    }
    socket.addEventListener("open", () => resolve(), { once: true });
    socket.addEventListener("error", () => reject(new Error("WebSocket connection failed")), { once: true });
  });
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef(new Set<(msg: CellClickMessage) => void>());
  const [gameStoped, setGameStoped] = useState({
    stoped: false,
    name: ""
  })

  const getSocket = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
      return socketRef.current;
    }
    const socket = new WebSocket(WS_URL);
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("[ws] received", msg);
      if (msg.type === "cellClick") {
        listenersRef.current.forEach((listener) => listener(msg));
      } else if (msg.type === "stop") {
        setGameStoped({
          stoped: true,
          name: msg.name
        })
      }
    };
    socketRef.current = socket;
    return socket;
  }, []);

  const joinGame = useCallback(async (gameId: string, name: string) => {
    const socket = getSocket();
    await waitForOpen(socket);
    socket.send(JSON.stringify({ type: "join", gameId, name }));
  }, [getSocket]);

  const sendCellClick = useCallback((gameId: string, index: number, color: number[]) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: "cellClick", gameId, index, color }));
  }, []);

  const stopGame = useCallback((gameId: string, name: string) => {
    const socket = socketRef.current
    console.log("[ws] stopGame called, readyState =", socket?.readyState)
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send((JSON.stringify({ type: "stop", gameId, name })))
  }, [])

  const subscribeToCellClicks = useCallback((callback: (msg: CellClickMessage) => void) => {
    listenersRef.current.add(callback);
    return () => {
      listenersRef.current.delete(callback);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ joinGame, sendCellClick, subscribeToCellClicks, stopGame, gameStoped }}>
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
