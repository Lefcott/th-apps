/** @format */

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

// rimport 'cypress-file-upload';

// import { loadApiUrl } from "../../src/utils/environment";

// const { communityId: ids, ENVIRONMENT: ENV } = Cypress.env();
// let graphUrl = loadApiUrl("staging");
// let communityId = ids[ENV];

// let getEventsQuery = `{
//   community(id: "${communityId}") {
//     _id
//     _type
//     events(includePast: true, onlyPublished: false, limit: 1000) {
//       _id
//       series {
//         _id
//       }
//     }
//   }
// }`;

// Cypress.Commands.add("deleteEventsForThisCommunity", () => {
//   let token = Cypress.env("TOKEN");
//   cy.request({
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     url: graphUrl, // graphql endpoint
//     body: { query: getEventsQuery },
//     failOnStatusCode: true,
//   }).then((res) => {
//     let events = res.body.data.community.events;
//     let eventsBySeries = groupBy(events, (e) => e.series._id); //weird way to do it but may want this info later

//     let deleteEvents = map(eventsBySeries, (events, series) =>
//       cy.request({
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         url: graphUrl,
//         body: {
//           query: `mutation {
//               community(id: "${communityId}") {
//                 series(id: "${series}") {
//                   remove(force: true) {
//                     name
//                   }
//                 }
//               }
//             }`,
//         },
//         failOnStatusCode: true,
//       })
//     );
//     Promise.all(deleteEvents);

//     cy.log(
//       Object.keys(eventsBySeries).length +
//         " Series deleted with Events total: " +
//         reduce(eventsBySeries, (p, c) => p + c.length, 0)
//     );
//   });
// });

// This is a nifty debug tool that slows down the commands so you can see actions in closer to human speed
const COMMAND_DELAY = 500; //ms
if (Cypress.env("SLOW")) {
  for (const command of [
    "visit",
    "click",
    "trigger",
    "type",
    "clear",
    "reload",
    "contains",
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

Cypress.Commands.add("getIframe", () => {
  // get the iframe > document > body
  // and retry until the body element is not empty
  cy.log("getIframeBody");

  return (
    cy
      .get("iframe", { log: false })
      .its("0.contentDocument.body", { log: false })
      .should("not.be.empty")
      // wraps "body" DOM element to allow
      // chaining more Cypress commands, like ".find(...)"
      // https://on.cypress.io/wrap
      .then((body) => cy.wrap(body, { log: false }))
  );
});

before(() => {
  console.log("we are running generateToken");
  cy.exec(
    "sh ./generateToken.sh Richard.Belding@k4connect.com DashboardTest staging"
  ).then((res) => {
    cy.log(res.stdout);
    Cypress.env("TOKEN", res.stdout);
  });
});

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});
