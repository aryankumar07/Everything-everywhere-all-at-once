import axios from "axios";
import type { GameState, PendingIdentity } from "./types";

// Axios talks to the Express lobby backend for the request/response endpoints
// (`/create`, `/join`). The live `/getPlayer` stream is SSE and is handled
// separately in `subscribePlayers.ts` (browser axios can't stream a POST SSE).
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Default round length (seconds) sent as the game's `timer`. The create modal
// doesn't collect one yet, so we default it here.
export const DEFAULT_DURATION = 60;

type CreateResponse = {
  msg: string;
  gameId: string;
  gameDetails: GameState;
};

type JoinResponse = {
  msg: string;
  gameId: string;
  gameData: GameState;
};

// POST /create — the admin creates the lobby. Returns the initial roster
// (just the creator).
export const createGame = async (
  gameId: string,
  identity: PendingIdentity,
): Promise<GameState> => {
  const { data } = await api.post<CreateResponse>("/create", {
    gameId,
    clientId: identity.clientId,
    playerName: identity.playerName,
    color: identity.color,
    isAdmin: identity.isAdmin,
    timer: DEFAULT_DURATION,
  });
  return data.gameDetails;
};

// POST /join — a non-admin joins an existing lobby. Must run AFTER an SSE
// subscription is registered for the game, or the backend responds 400.
export const joinGame = async (
  gameId: string,
  identity: PendingIdentity,
): Promise<GameState> => {
  const { data } = await api.post<JoinResponse>("/join", {
    gameId,
    clientId: identity.clientId,
    playerName: identity.playerName,
    color: identity.color,
    isAdmin: identity.isAdmin,
  });
  return data.gameData;
};

// POST /start — the admin starts the game. The backend pushes a START sentinel
// down every player's lobby SSE stream, which is what triggers the redirect.
export const startGameRequest = async (gameId: string): Promise<void> => {
  await api.post(`/start/${gameId}`);
};

export default api;
