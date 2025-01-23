# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including babel plugin
RUN npm ci && \
    npm install --save-dev @babel/plugin-proposal-private-property-in-object@^7.21.11 && \
    npm install --save-dev @babel/core@^7.22.5 && \
    npm install --save-dev babel-preset-react-app@^10.0.1

# Copy source files
COPY . .

# Build the app with explicit environment variables
ENV SKIP_PREFLIGHT_CHECK=true
ENV DISABLE_ESLINT_PLUGIN=true
ENV CI=false
ENV NODE_ENV=production

RUN npm run build

# Production stage
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create start script
RUN echo '#!/bin/sh\n\
PORT="${PORT:-8080}"\n\
sed -i "s/listen 80/listen $PORT/" /etc/nginx/nginx.conf\n\
nginx -g "daemon off;"' > /start.sh && \
chmod +x /start.sh

CMD ["/start.sh"]
