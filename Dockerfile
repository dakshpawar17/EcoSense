# Dockerfile for EcoSense Full-Stack Application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and package manifests
COPY package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install all dependencies
RUN npm run install:all

# Copy source code
COPY backend ./backend
COPY frontend ./frontend

# Build backend and frontend
RUN npm run build --prefix backend
RUN npm run build --prefix frontend

EXPOSE 5000 3000

CMD ["npm", "run", "dev"]
