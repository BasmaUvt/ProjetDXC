# Start from the official Cypress base image
FROM cypress/base:16.20.1

# Set the working directory
WORKDIR /usr/src/app

# Change the owner of the working directory to 'node'
RUN chown node:node /usr/src/app

# Change to 'node' user
USER node

# Copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm ci

# Uninstall Cypress
RUN npm uninstall cypress

# Reinstall Cypress
RUN npm install cypress@12.17.4

# Copy the rest of your app's source code
COPY --chown=node:node . .

# Your app starts here
CMD ["npx", "nodemon", "server.js"]