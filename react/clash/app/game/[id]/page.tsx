"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "@/utils/socketContext";
import { readPendingIdentity } from "@/utils/identity";
import type { PendingIdentity } from "@/utils/types";
import GameGrid from "@/component/game/GameGrid";
import WinnerPopup from "@/component/game/WinnerPopup";

const BOX_COUNT = 12;
const COUNTDOWN_FROM = 3;
const RETURN_DELAY_MS = 1800;

type Phase = "connecting" | "countdown" | "playing" | "finished";

export default function GamePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const gameId = params.id;
  const { connect, sendClick, sendStop, subscribe } = useSocket();

  const [identity, setIdentity] = useState<PendingIdentity | null>(null);
  const [phase, setPhase] = useState<Phase>("connecting");
  const [ready, setReady] = useState({ count: 0, total: 0 });
  const [count, setCount] = useState(COUNTDOWN_FROM);
  const [board, setBoard] = useState<(string | null)[]>(
    Array(BOX_COUNT).fill(null),
  );
  const [winner, setWinner] = useState<string | null>(null);

  const countdownStartedRef = useRef(false);
  const stopFiredRef = useRef(false);

  // Connect the WebSocket, JOIN the room, and react to gameplay broadcasts.
  useEffect(() => {
    const id = readPendingIdentity(gameId);
    if (!id) {
      router.replace("/");
      return;
    }

    const unsubscribe = subscribe((msg) => {
      if (msg.type === "READY") {
        setReady({ count: msg.count, total: msg.total });
        // Everyone's socket is in — kick off the synced countdown once.
        if (
          !countdownStartedRef.current &&
          msg.total > 0 &&
          msg.count >= msg.total
        ) {
          countdownStartedRef.current = true;
          setCount(COUNTDOWN_FROM);
          setPhase("countdown");
        }
      } else if (msg.type === "CLICK") {
        setBoard((prev) => {
          const next = [...prev];
          next[msg.index] = msg.color;
          return next;
        });
      } else if (msg.type === "STOP") {
        setWinner(msg.name);
        setPhase("finished");
      }
    });

    (async () => {
      setIdentity(id);
      try {
        await connect(gameId);
      } catch {
        // Connection failures leave the player on the "connecting" screen.
      }
    })();

    return () => unsubscribe();
  }, [gameId, router, connect, subscribe]);

  // Countdown ticker: 3 → 2 → 1 → play. All state changes happen inside the
  // timeout so we never set state synchronously in an effect body.
  useEffect(() => {
    if (phase !== "countdown") return;
    const timer = setTimeout(() => {
      if (count <= 1) {
        setPhase("playing");
      } else {
        setCount(count - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase, count]);

  // Win detection: once every box is my color, fire STOP (exactly once).
  useEffect(() => {
    if (phase !== "playing" || !identity) return;
    const allMine = board.every((c) => c === identity.color);
    if (allMine && !stopFiredRef.current) {
      stopFiredRef.current = true;
      sendStop(gameId, identity.playerName);
    }
  }, [board, phase, identity, gameId, sendStop]);

  // After the winner popup, send everyone back to the lobby.
  useEffect(() => {
    if (phase !== "finished") return;
    const timer = setTimeout(
      () => router.push(`/lobby/${gameId}`),
      RETURN_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [phase, gameId, router]);

  const onCellClick = (index: number) => {
    if (phase !== "playing" || !identity) return;
    sendClick(gameId, index, identity.color);
  };

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-6 p-4">
      <div className="w-full max-w-md text-center">
        {phase === "connecting" && (
          <p className="text-lg text-zinc-500">
            Waiting for players… {ready.count}
            {ready.total ? `/${ready.total}` : ""}
          </p>
        )}
        {phase === "countdown" && (
          <p className="text-6xl font-bold tabular-nums">{count}</p>
        )}
        {phase === "playing" && identity && (
          <p className="flex items-center justify-center gap-2 text-lg text-zinc-500">
            Turn every box
            <span
              className="inline-block h-4 w-4 rounded-sm ring-1 ring-black/20"
              style={{ backgroundColor: identity.color }}
            />
            yours!
          </p>
        )}
      </div>

      <div className="w-full max-w-md">
        <GameGrid
          board={board}
          disabled={phase !== "playing"}
          onCellClick={onCellClick}
        />
      </div>

      {winner && <WinnerPopup name={winner} />}
    </div>
  );
}
