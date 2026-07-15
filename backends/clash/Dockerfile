FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY index.js ./
COPY utils ./utils

EXPOSE 8000

CMD ["node", "index.js"]
