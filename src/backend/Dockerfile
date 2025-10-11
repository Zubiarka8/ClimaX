FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
