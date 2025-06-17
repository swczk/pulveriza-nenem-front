FROM node:18-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine AS production-stage

# Install certbot for SSL
RUN apk add --no-cache certbot certbot-nginx

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.prod.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
