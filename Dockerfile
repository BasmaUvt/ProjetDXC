FROM cypress/browsers:node14.17.0-chrome88-ff89
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "server.js"]

