/** @format */
import 'cypress-file-upload';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// This is a nifty debug tool that slows down the commands so you can see actions in closer to human speed
const COMMAND_DELAY = 500; //ms
if (Cypress.env('SLOW')) {
  for (const command of [
    'visit',
    'click',
    'trigger',
    'type',
    'clear',
    'reload',
    'contains',
  ]) {
    Cypress.Commands.overwrite(command, (originalFn, ...args) => {
      const origVal = originalFn(...args);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(origVal);
        }, COMMAND_DELAY);
      });
    });
  }
}

Cypress.Commands.add('getIframe', () => {
  // get the iframe > document > body
  // and retry until the body element is not empty
  cy.log('getIframeBody');

  return (
    cy
      .get('iframe', { log: false })
      .its('0.contentDocument.body', { log: false })
      .should('not.be.empty')
      // wraps "body" DOM element to allow
      // chaining more Cypress commands, like ".find(...)"
      // https://on.cypress.io/wrap
      .then((body) => cy.wrap(body, { log: false }))
  );
});

before(() => {
  console.log('Executing ./generateToken');
  cy.exec(
    'sh ./generateToken.sh Richard.Belding@k4connect.com DashboardTest staging',
  ).then((res) => {
    cy.log('stdout', res.stdout);
    cy.log('stderr', res.stderr);
    Cypress.env('TOKEN', res.stdout);
  });
});
