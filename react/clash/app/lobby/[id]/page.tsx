"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { createGame, joinGame, startGameRequest, DEFAULT_DURATION } from "@/utils/api";
import { subscribePlayers, type PlayersSubscription } from "@/utils/subscribePlayers";
import { readPendingIdentity } from "@/utils/identity";
import type { GameState, PendingIdentity } from "@/utils/types";
import ChalkBoard from "@/component/lobby/ChalkBoard";
import PlayerList from "@/component/lobby/PlayerList";

const errorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.msg ?? err.message;
  }
  return err instanceof Error ? err.message : "Something went wrong";
};

export default function LobbyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const gameId = params.id;

  const [identity, setIdentity] = useState<PendingIdentity | null>(null);
  const [game, setGame] = useState<GameState>({
    duration: DEFAULT_DURATION,
    players: [],
  });
  const [error, setError] = useState<string | null>(null);

  // Holds the in-flight /create or /join call. Sharing the promise (rather than
  // a boolean "did we run it" flag) means the call fires exactly once AND its
  // roster is applied by whichever mount survives React's dev double-invoke —
  // otherwise the created admin's own roster gets dropped and they don't appear
  // until someone else joins.
  const mutationRef = useRef<Promise<GameState> | null>(null);

  useEffect(() => {
    const identity = readPendingIdentity(gameId);
    if (!identity) {
      // No identity for this game (e.g. someone opened the URL directly) —
      // send them back to pick a name / game.
      router.replace("/");
      return;
    }

    let cancelled = false;
    let sub: PlayersSubscription | null = null;

    // Every player (admin included) lands in the game route via this SSE START
    // signal, so the whole lobby moves together.
    const goToGame = () => router.push(`/game/${gameId}`);

    (async () => {
      try {
        setIdentity(identity);
        if (identity.isAdmin) {
          // Admin: create the game first (the SSE endpoint 400s until the game
          // exists), then subscribe for future joins.
          try {
            if (!mutationRef.current) {
              mutationRef.current = createGame(gameId, identity);
            }
            const roster = await mutationRef.current;
            if (cancelled) return;
            setGame(roster);
          } catch (err) {
            // Coming back after a finished round: the game already exists.
            // Tolerate the 400 and just watch the roster.
            if (!(axios.isAxiosError(err) && err.response?.status === 400)) {
              throw err;
            }
          }
          if (cancelled) return;
          sub = subscribePlayers(gameId, setGame, goToGame);
        } else {
          // Joiner: subscribe first (backend requires a live SSE connection
          // before it accepts a join), then join once the stream is open.
          sub = subscribePlayers(gameId, setGame, goToGame);
          await sub.ready;
          if (cancelled) return;
          if (!mutationRef.current) {
            mutationRef.current = joinGame(gameId, identity);
          }
          const roster = await mutationRef.current;
          if (cancelled) return;
          setGame(roster);
        }
      } catch (err) {
        if (!cancelled) setError(errorMessage(err));
      }
    })();

    return () => {
      cancelled = true;
      sub?.close();
    };
  }, [gameId, router]);

  // Admin-only. POSTing /start makes the backend push a START down every
  // player's SSE stream, so everyone (including us) redirects to the game route.
  const onStartGame = async () => {
    try {
      await startGameRequest(gameId);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-4 p-4">
      <ChalkBoard title="Lobby">
        <p className="font-chalk mb-3 text-center text-lg text-[#f5f5f0]/50">
          game&nbsp;#&nbsp;{gameId}
        </p>

        {error ? (
          <p className="font-chalk py-4 text-center text-xl text-red-300">
            {error}
          </p>
        ) : (
          <PlayerList players={game.players} />
        )}
      </ChalkBoard>

      {identity?.isAdmin && !error && (
        <button
          onClick={onStartGame}
          className="w-full max-w-md rounded-2xl border border-black bg-white p-2 font-bold text-black transition-colors hover:cursor-grab dark:border-zinc-600 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
        >
          START GAME
        </button>
      )}
    </div>
  );
}
