const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000/',
    specPattern: '**/*chat-spec.js',
    // specPattern: '**/*index-spec.js',
    // other e2e options here
  },
})