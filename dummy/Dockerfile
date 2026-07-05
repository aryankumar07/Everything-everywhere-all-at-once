FROM node:22-alpine

# Enable pnpm via corepack
RUN corepack enable

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Copy application source
COPY . .

ENV PORT=3000
ENV APPID=default-app-id
EXPOSE 3000

CMD ["pnpm", "start"]
