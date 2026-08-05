// Shapes shared across the lobby flow. These mirror the Express backend
// (`backends/clash`) exactly — every player object it stores/returns has these
// four fields, and the SSE/create/join payloads wrap a roster in `GameState`.

export type Player = {
  clientId: string;
  playerName: string;
  color: string;
  isAdmin: boolean;
};

export type GameState = {
  duration: number;
  players: Player[];
};

// What we carry from the home page into the lobby route across the redirect.
export type PendingIdentity = {
  clientId: string;
  playerName: string;
  color: string;
  isAdmin: boolean;
};
