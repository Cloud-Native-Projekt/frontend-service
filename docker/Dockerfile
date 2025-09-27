# Install dependencies (with devDependencies)
FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the app
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Install build deps temporarily and run build in one layer
RUN apk add --no-cache python3 make g++ libc6-compat \
  && npm run build \
  && apk del python3 make g++ libc6-compat

# Production runner
FROM node:24-alpine AS runner
WORKDIR /app

# Only copy necessary files
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Install only prod dependencies
COPY package*.json ./
RUN npm ci

EXPOSE 3000
CMD ["npm", "start"]