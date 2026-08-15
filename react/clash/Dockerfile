# syntax=docker/dockerfile:1

FROM node:20-alpine AS base

# 1. Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the client bundle by `next build`, so
# the backend URL must be known HERE — a runtime env var on Render is too late.
# The committed `.env.production` supplies the default.
#
# Render turns a service's environment variables into Docker build args, but
# only args DECLARED here are actually passed through — hence both spellings,
# so either name works in the Render dashboard.
ARG NEXT_PUBLIC_API_URL
ARG API_URL
#
# The shell dance matters. An ARG that is declared and set (even to "") lands in
# the RUN environment, and `process.env` outranks every `.env` file in Next's
# load order — so a blank dashboard field would silently bake an empty URL and
# shadow `.env.production`. Unsetting both names first makes that impossible;
# a real value is handed over via `.env.production.local`, which outranks
# `.env.production` but still loses to nothing.
RUN VALUE="${NEXT_PUBLIC_API_URL:-$API_URL}"; \
    unset NEXT_PUBLIC_API_URL API_URL; \
    if [ -n "$VALUE" ]; then \
      echo "NEXT_PUBLIC_API_URL=$VALUE" > .env.production.local; \
    fi; \
    npm run build

# 3. Production runtime image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Render injects its own PORT at runtime and the standalone server honours it;
# these are the local-docker defaults. HOSTNAME must be 0.0.0.0 or the
# container only listens on loopback and Render's health check never passes.
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
