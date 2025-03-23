const { defineConfig } = require( "cypress" );

module.exports = defineConfig( {

  defaultCommandTimeout: 10000,

  video: false,

  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: true,
  },
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:3000/",
    setupNodeEvents ( on, config )
    {

    },
  },
} );
