# Dummy Backend

A minimal Node.js + Express backend with three basic routes. Uses ES Modules,
CORS, and request logging via morgan.

## Setup

```bash
pnpm install
```

## Run

```bash
pnpm dev     # auto-reload with nodemon
pnpm start   # plain node
```

The server listens on `http://localhost:3000` (override with the `PORT` env var).

## Routes

| Method | Path        | Description        | Example response                                                      |
| ------ | ----------- | ------------------ | -------------------------------------------------------------------- |
| GET    | `/`         | Hello message      | `{ "message": "Hello from the Express backend!" }`                   |
| GET    | `/health`   | Health check       | `{ "status": "ok", "uptime": 1.23, "timestamp": "..." }`            |
| GET    | `/api/info` | App/version info   | `{ "name": "dummy-backend", "version": "1.0.0", "node": "v24..." }` |

Any other path returns `404` with `{ "error": "Not Found" }`.
