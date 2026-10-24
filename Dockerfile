# Node 24 LTS (supported until April 2028). The floating tag picks up Node and Debian security patches on every
# rebuild; the publish workflow also rebuilds weekly so they land even without new commits.
FROM node:25-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --omit=dev \
  && mkdir -p /data && chown node:node /data

ENV DATA_DIR=/data \
    PORT=3000
USER node
VOLUME ["/data"]
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "--disable-warning=ExperimentalWarning", "server/index.js"]
