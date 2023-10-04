FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && chown -R node:node /usr/src/app

USER node

COPY . .

CMD ["npx", "nodemon", "server.js"]