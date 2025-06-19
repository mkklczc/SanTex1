FROM node:20-slim
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.5 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json
COPY webapp/package.json ./webapp/package.json
RUN pnpm install --frozen-lockfile
COPY backend ./backend
COPY webapp ./webapp
CMD ["pnpm", "dev"]