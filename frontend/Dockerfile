# Stage 1: Build Angular
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build -- --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Clean default files
RUN rm -rf /usr/share/nginx/html/*

# Copy built files (Angular 17+ structure)
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy the template to the special directory for environment substitution
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

# The standard Nginx image entrypoint handles substitution automatically
CMD ["nginx", "-g", "daemon off;"]