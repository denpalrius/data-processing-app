FROM node:22

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3002

CMD ["pnpm", "start:prod"]