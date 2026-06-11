# Lux CDN — Next.js static export served by hanzoai/static.
#
# Build:   node + pnpm → next build (output: 'export') → out/
# Runtime: ghcr.io/hanzoai/static (STATIC_ROOT=/srv, SPA routing) — the
#          canonical Hanzo static server. The base is private; CI logs into
#          ghcr with GHCR_PAT (cross-org read) before building.

FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN npm --no-update-notifier --no-fund --global install pnpm@10.6.1
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm run build

FROM ghcr.io/hanzoai/static:0.4.1
ENV STATIC_ROOT=/srv
ENV STATIC_SPA=true
COPY --from=build /app/out /srv
EXPOSE 80
