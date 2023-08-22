const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000/',
    specPattern: '**/*index_spec.js',
    // other e2e options here
  },
})