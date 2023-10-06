# Start from the official Cypress base image
FROM cypress/base:14

# Set the working directory
WORKDIR /usr/src/app

# Change the owner of the working directory to 'node'
RUN chown node:node /usr/src/app

# Change to 'node' user
USER node

# Copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# Disable Cypress install verification
ENV CYPRESS_INSTALL_BINARY=0

# Install dependencies and install Cypress
RUN npm ci

# Copy the rest of your app's source code
COPY --chown=node:node . .

# Your app starts here
CMD ["npx", "nodemon", "server.js"]