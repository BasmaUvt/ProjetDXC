# Utilisez une image Node.js avec toutes les dépendances nécessaires pour Cypress
FROM cypress/browsers:node16

WORKDIR /app

# Copiez les fichiers package.json et package-lock.json
COPY package*.json ./

# Installez les dépendances
RUN npm ci

# Copiez le reste des fichiers de l'application
COPY . .

CMD ["node", "server.js"]

