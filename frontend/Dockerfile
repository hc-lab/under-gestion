# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && ls -la build/

# Production stage
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/* && rm -rf /etc/nginx/conf.d/default.conf

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html/

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Verify files were copied correctly
RUN ls -la /usr/share/nginx/html/ && \
    echo "Content of index.html:" && \
    cat /usr/share/nginx/html/index.html

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
