# Start from the official Node.js image
FROM node:16.20.1

# Set the working directory
WORKDIR /usr/src/app

# Change the owner of the working directory to 'node'
RUN chown -R node:node /usr/src/app

# Change to 'node' user
USER node

# Copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm ci

# Reinstall Cypress
RUN npm install cypress@12.17.4

# Copy the rest of your app's source code
COPY --chown=node:node . .

# Your app starts here
CMD ["npx", "nodemon", "server.js", "cypress"]