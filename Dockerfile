
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
COPY . .
EXPOSE 8080
CMD ["npm", "start" , "node", "nodemon", "./app.js"]