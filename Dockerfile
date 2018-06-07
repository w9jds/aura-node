FROM node:9.5.0-slim

ENV NODE_ENV = 'production'

ENV BOT_TOKEN 'Bot token from: https://discordapp.com/developers/applications/me'

WORKDIR /opt/auth

COPY ./build ./build
COPY ./package.json ./
RUN npm install

EXPOSE 8000

ENTRYPOINT [ "node" ]

CMD ["./build/aura.js"]