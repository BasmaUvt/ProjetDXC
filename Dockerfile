# Start from a base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Change the owner of the working directory to 'node'
RUN chown node:node /usr/src/app

# Change to 'node' user
USER node

# Copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# Install dependencies and install Cypress
RUN npm install && npm install --save-dev cypress

# Copy the rest of your app's source code
COPY --chown=node:node . .

# Your app starts here
CMD ["npx", "nodemon", "server.js"]