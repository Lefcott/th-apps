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

import 'cypress-file-upload';
import { reduce, map, groupBy } from 'lodash';

const {
  communityId: ids,
  ENVIRONMENT: ENV,
  GRAPH_URL: apiUrls,
} = Cypress.env();
let graphUrl = apiUrls[ENV];
let communityId = ids[ENV];

let getContentQuery = `{
  community(id: "${communityId}") {
    contents (page: {limit: 100, field: Edited, order: Desc}, filters: {onlyMine:true}) {
      _id
    }
  }
}`;

Cypress.Commands.add('deleteContentForThisCommunity', () => {
  let token = Cypress.env('TOKEN');
  try {
    cy.request({
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      url: graphUrl, // graphql endpoint
      body: { query: getContentQuery },
      failOnStatusCode: true,
    }).then((res) => {
      let content = res.body.data && res.body.data.community.contents;
      let contentToDelete = map(content, (poc) => {
        cy.request({
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          url: graphUrl,
          body: {
            query: `mutation {
              community(id: "${communityId}") {
                content(id: "${poc._id}") {
                  delete {
                    _id
                  }
                }
              }
            }`,
          },
          failOnStatusCode: true,
        });
      });
      Promise.all(contentToDelete);

      cy.log('Pieces of content deleted: ' + content.length);
    });
  } catch (error) {
    console.log('___-_-_error_-_-___ :\n\n\n', error, '\n\n');
  }
});

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
  cy.exec(
    'sh ./generateToken.sh Richard.Belding@k4connect.com DashboardTest staging'
  ).then((res) => {
    console.log('TOKEN: ', res.stdout);
    Cypress.env('TOKEN', res.stdout);
    cy.deleteContentForThisCommunity();
  });
});

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});
