# syntax=docker/dockerfile:1

# Etapa 1: gera o site estático em /app/dist
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# Etapa 2: serve o dist/ com Nginx sem root, na porta 8080
FROM nginxinc/nginx-unprivileged:stable-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/cabecalhos-seguranca.conf /etc/nginx/snippets/cabecalhos-seguranca.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/saude || exit 1
