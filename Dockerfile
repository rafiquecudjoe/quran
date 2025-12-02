# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Traefik labels
LABEL traefik.enable=true
LABEL traefik.http.middlewares.frontend-gzip.compress=true
LABEL traefik.http.middlewares.frontend-redirect-https.redirectscheme.scheme=https
LABEL traefik.http.middlewares.frontend-redirect-https.redirectscheme.permanent=true
LABEL traefik.http.routers.frontend-http.entrypoints=http
LABEL traefik.http.routers.frontend-http.rule=Host(`bsc00gsw8cko4880sc8wswwc.159.69.153.112.sslip.io`) || Host(`www.ismailacademy.net`) || Host(`ismailacademy.net`)
LABEL traefik.http.routers.frontend-http.middlewares=frontend-redirect-https@docker
LABEL traefik.http.routers.frontend-https.entrypoints=https
LABEL traefik.http.routers.frontend-https.rule=Host(`bsc00gsw8cko4880sc8wswwc.159.69.153.112.sslip.io`) || Host(`www.ismailacademy.net`) || Host(`ismailacademy.net`)
LABEL traefik.http.routers.frontend-https.tls=true
LABEL traefik.http.routers.frontend-https.tls.certresolver=letsencrypt
LABEL traefik.http.routers.frontend-https.middlewares=frontend-gzip@docker
LABEL traefik.http.routers.frontend-https.service=frontend
LABEL traefik.http.services.frontend.loadbalancer.server.port=80

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
