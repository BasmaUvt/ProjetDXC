FROM node:14

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app

USER node

CMD ["bash", "-c", "npm install && npx nodemon server.js"]