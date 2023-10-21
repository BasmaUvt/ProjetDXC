const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000/',
    specPattern: '**/*chat-spec.js',
    //specPattern: '**/*index-spec.js',
    //specPattern: '**/*message_test.js',
  },
})