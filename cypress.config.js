const { defineConfig } = require( "cypress" );

module.exports = defineConfig( {

  defaultCommandTimeout: 10000,
  video: false,
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:3000",

  },
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "reporter-config.json",
  },
  // e2e: {
  //   setupNodeEvents ( on, config )
  //   {
  //     // implement node event listeners here
  //   },
  // },
} );
