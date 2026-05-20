# Use the official Bun image as base
FROM oven/bun:1-alpine AS base

# --- Stage 1: Install dependencies ---
FROM base AS deps
# Install libc6-compat for compatibility with native node modules if any
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package configuration and lockfiles
COPY package.json package-lock.json* bun.lockb* ./
# Install dependencies using Bun
RUN bun install

# --- Stage 2: Build the application ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN bun run build

# --- Stage 3: Production Runner ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create nextjs system user/group for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set correct permissions for Next.js prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy the standalone build, public assets, and static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Use the non-root user
USER nextjs

# Expose the default port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run the Next.js standalone server using Bun
CMD ["bun", "server.js"]
