# -----------------------
# 1) Build stage
# -----------------------
FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src ./src

RUN npm run build

# -----------------------
# 2) Production stage
# -----------------------
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
EXPOSE 3000

COPY package*.json ./

RUN npm ci

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/uploads && chown -R node:node /app

# 권한 변경 후 계정 전환
USER node

CMD ["npm", "run", "start:prod"]