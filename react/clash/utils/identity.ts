import type { PendingIdentity } from "./types";

// The home page generates a player's identity (clientId, name, color, admin
// flag) and hands it to the lobby route across a client-side navigation. We
// stash it in sessionStorage — keyed by gameId — instead of the URL so names
// and the admin flag stay out of shareable links.

const key = (gameId: string) => `clash:identity:${gameId}`;

export const setPendingIdentity = (
  gameId: string,
  identity: PendingIdentity,
): void => {
  sessionStorage.setItem(key(gameId), JSON.stringify(identity));
};

export const readPendingIdentity = (
  gameId: string,
): PendingIdentity | null => {
  try {
    const raw = sessionStorage.getItem(key(gameId));
    return raw ? (JSON.parse(raw) as PendingIdentity) : null;
  } catch {
    return null;
  }
};
