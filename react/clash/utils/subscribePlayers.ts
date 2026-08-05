import type { GameState } from "./types";

export type PlayersSubscription = {
  // Resolves once the backend confirms the stream is open ("connection
  // established"). The joiner waits on this before POSTing /join, since the
  // backend rejects a join until an SSE connection is registered.
  ready: Promise<void>;
  // Tear down the stream (call on unmount).
  close: () => void;
};

// The `/getPlayer/:gameId` endpoint is a POST-based SSE stream, which the
// browser's EventSource/axios cannot consume. We read it manually with fetch +
// a stream reader, parsing the raw `data:` frames the backend emits:
//   data:connection established   -> stream is open
//   data:ping                     -> keepalive, ignored
//   data:START                    -> admin started the game, navigate to play
//   data:{"duration":..,"players":[..]}  -> a roster update
export const subscribePlayers = (
  gameId: string,
  onPlayers: (game: GameState) => void,
  onStart?: () => void,
): PlayersSubscription => {
  const controller = new AbortController();

  let resolveReady!: () => void;
  let rejectReady!: (err: unknown) => void;
  const ready = new Promise<void>((resolve, reject) => {
    resolveReady = resolve;
    rejectReady = reject;
  });

  const url = `${process.env.NEXT_PUBLIC_API_URL}/getPlayer/${gameId}`;

  (async () => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { Accept: "text/event-stream" },
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`getPlayer stream failed: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Read frames until the stream ends or is aborted. SSE frames are
      // separated by a blank line ("\n\n").
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let sep: number;
        while ((sep = buffer.indexOf("\n\n")) !== -1) {
          const frame = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          handleFrame(frame);
        }
      }
    } catch (err) {
      // Aborting on close() surfaces as an AbortError — that's expected.
      if (!controller.signal.aborted) rejectReady(err);
    }
  })();

  function handleFrame(frame: string) {
    // A frame may have multiple `data:` lines; concatenate their payloads.
    const data = frame
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).replace(/^ /, ""))
      .join("\n")
      .trim();

    if (!data) return;

    if (data === "connection established") {
      resolveReady();
      return;
    }
    if (data === "ping") return;
    if (data === "START") {
      onStart?.();
      return;
    }

    try {
      onPlayers(JSON.parse(data) as GameState);
    } catch {
      // Ignore anything that isn't a JSON roster payload.
    }
  }

  return {
    ready,
    close: () => controller.abort(),
  };
};
