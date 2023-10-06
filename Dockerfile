# Start from a base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app
# Switch to 'node' user
USER node
# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies and install Cypress
RUN npm install && npm install --save-dev cypress

# Change the ownership of app directory
RUN chown -R node:node /usr/src/app

# Copy the rest of your app's source code
COPY --chown=node:node . .

# Your app starts here
CMD ["npx", "nodemon", "server.js"]