# Utilisez une image Node.js avec toutes les dépendances nécessaires pour Cypress
FROM cypress/node14

WORKDIR /app

# Copiez les fichiers package.json et package-lock.json
COPY package*.json ./

# Installez les dépendances
RUN npm ci

# Copiez le reste des fichiers de l'application
COPY . .

# Exécutez le serveur et les tests
CMD ["npm", "run", "start:test"]