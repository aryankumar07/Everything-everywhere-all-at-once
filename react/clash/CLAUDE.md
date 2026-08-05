# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> The line above imports `AGENTS.md`, which is tool-managed (note its `BEGIN/END`
> markers). Do not put durable guidance there — it may be regenerated. Edit this
> file instead.

## Commands

- `npm run dev` — start the Next.js dev server (http://localhost:3000).
- `npm run build` — production build (`output: "standalone"`, see `next.config.ts`).
- `npm start` — serve the production build.
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript).

No test runner is configured. `npm ci` (Dockerfile) uses `package-lock.json`, but a
`pnpm-lock.yaml` is also committed — pick one lockfile before adding deps to avoid drift.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4
(via `@tailwindcss/postcss`, no `tailwind.config`). Import alias: `@/*` → repo root.

## Architecture

**Clash** is the *frontend* of a real-time multiplayer "finger clash" game. The game
server is a **separate WebSocket backend** — this repo only renders the UI and talks to
it over a socket. There is no API-route/server code here for game logic.

- **`utils/socketContext.tsx` is the core.** A single shared `WebSocket` lives in
  `SocketProvider` (`socketRef`), created lazily on first `joinGame`. The app is wrapped
  in this provider in `app/layout.tsx`, so `useSocket()` is the only sanctioned way to
  reach the socket — never open a second connection.
  - Outbound message types: `join`, `cellClick`, `stop` (JSON over the socket).
  - Inbound: `cellClick` is fan-out to a `Set` of listeners registered via
    `subscribeToCellClicks` (returns an unsubscribe fn — call it on unmount); `stop`
    updates the `gameStoped` context state.
  - `WS_URL` is currently **hardcoded** to `ws://localhost:8000/ws` inside this file.
    An unused `NEXT_PUBLIC_WS_URL` env var exists in `.env.local` — wire the code to it
    rather than editing the constant when changing environments.

- **Theming** is class-free / attribute-driven: `data-theme="dark|light"` on `<html>`.
  An inline `<head>` script in `app/layout.tsx` reads `localStorage.theme` before paint
  to prevent flash; `component/theme/ThemeToggle.tsx` flips the attribute and persists it.
  Style variants with Tailwind's `dark:` prefix (driven by this attribute).

- **Routing / WIP:** `app/page.tsx` is the lobby entry (NEW GAME / JOIN GAME modals via
  `component/model`), and `app/lobby/[id]/page.tsx` is the in-game route. Note both
  `enterGame` (in `page.tsx`) and the lobby page are currently **empty stubs** — the
  join→navigate→play flow is not yet wired up.

## Non-obvious conventions

- This is a pinned, non-stable Next.js — per `AGENTS.md`, read the relevant guide under
  `node_modules/next/dist/docs/` before writing Next-specific code; APIs may differ from
  training data.
- `component/` (singular) and `utils/` sit at repo root, outside `app/`.
- `next.config.ts` sets `allowedDevOrigins: ["*"]` for dev; keep production origins tight.
