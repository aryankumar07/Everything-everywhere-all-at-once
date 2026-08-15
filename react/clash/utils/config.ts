// Single source of truth for where the Express/WS backend lives.
//
// `NEXT_PUBLIC_API_URL` is inlined into the client bundle at BUILD time (see
// Next's env docs), so it must be present when `next build` runs — not just at
// runtime. In Docker that means a build arg / `.env.production`, never a
// dashboard-only runtime variable.
//
// Note the literal `process.env.NEXT_PUBLIC_API_URL` member access below: Next
// only substitutes the exact expression, so it can't be read dynamically.
// `||` not `??` on purpose: an empty-string env var (an unset Docker ARG, a
// blank dashboard field) must fall back too, not inline `""`.
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Strip trailing slashes so `${API_URL}/join` never becomes `//join`.
export const API_URL = RAW_API_URL.replace(/\/+$/, "");

// The socket is derived from the SAME origin as the HTTP API so the two can
// never drift to different hosts: http -> ws, https -> wss, targeting `/ws`.
export const WS_URL = API_URL.endsWith("/ws")
  ? API_URL.replace(/^http/, "ws")
  : `${API_URL.replace(/^http/, "ws")}/ws`;

// A production bundle built without the env var would silently point at
// localhost and fail for every visitor. Fail loudly in the browser instead.
if (
  process.env.NODE_ENV === "production" &&
  typeof window !== "undefined" &&
  API_URL.includes("localhost")
) {
  console.error(
    "[clash] NEXT_PUBLIC_API_URL was not set at build time — the app is " +
      "pointing at localhost. Rebuild with the backend URL baked in.",
  );
}
