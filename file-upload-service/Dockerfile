
FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g pnpm@latest-10

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3002

CMD ["pnpm", "start:prod"]