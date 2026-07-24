# sqlite3 et bcrypt sont des paquets natifs (compilés C++) : sans python3/make/g++,
# `npm install` échoue silencieusement sur Alpine (même problème que sous Windows
# sans les Build Tools). 
FROM node:20-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
RUN apk add --no-cache python3 make g++
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
