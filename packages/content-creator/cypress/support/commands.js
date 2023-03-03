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

      return new Promise(resolve => {
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
      .get('iframe')
      .its('0.contentDocument')
      .should('exist')
      // wraps "body" DOM element to allow
      // chaining more Cypress commands, like ".find(...)"
      // https://on.cypress.io/wrap
      .then(body => cy.wrap(body))
  );
});


before(() => {
  console.log('we are running generateToken');
  cy.exec(
    'sh ./generateToken.sh Richard.Belding@k4connect.com DashboardTest staging',
  ).then((res) => {
    cy.log(res.stdout);
    Cypress.env('TOKEN', res.stdout);
  });

  // sessionId = Cypress.env('cypress_session');
  // if (sessionId) {
  //   cy.setCookie('session', sessionId);
  // } else {
    cy.request('POST', 'https://api-staging.k4connect.com/v2/sso/auth/login',{
      email: 'Richard.Belding@k4connect.com',
      password: 'DashboardTest',
    }).then((res) => {
      console.log('___-_-_res_-_-___ :\n\n\n', res, '\n\n');
      let session = res.headers['set-cookie'][0].split(';')[0].split('=')[1]
      Cypress.env('SESSION', session);
    });
  // }
});


Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

import { map } from 'lodash';

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




Cypress.Commands.add(
    "waitforpageidle",
    () => {
        console.warn("Waiting for page idle state");

        const pageIdleDetector = new PageIdleDetector();

        pageIdleDetector.WaitForPageToBeIdle();
    }
);

export class PageIdleDetector
{   
    defaultOptions = { timeout: 5000 };

    WaitForPageToBeIdle()
    {
        this.WaitForPageToLoad();
        this.WaitForAngularRequestsToComplete();
        this.WaitForAngularDigestCycleToComplete();
        this.WaitForAnimationsToStop();
    }

    WaitForPageToLoad(options = this.defaultOptions)
    {
        cy.document(options).should((myDocument) =>
        {
          console.log('___-_-_myDocument_-_-___ :\n\n\n', myDocument.readyState, '\n\n');
            expect(myDocument.readyState, "WaitForPageToLoad").to.be.oneOf(["interactive", "complete"]);
        });
    }

    WaitForAngularRequestsToComplete(options = this.defaultOptions)
    {
        cy.window(options).should((myWindow) =>
        {
          if (!!myWindow.angular)
          {
              console.log('___-_-_myWindow.angular_-_-___ :\n\n\n', myWindow.angular, '\n\n');
                expect(this.NumberOfPendingAngularRequests(myWindow), "WaitForAngularRequestsToComplete").to.have.length(0);
            }
        });
    }

    WaitForAngularDigestCycleToComplete(options = this.defaultOptions)
    {
        cy.window(options).should((myWindow) =>
        {
            if (!!myWindow.angular)
            {
                expect(ngularRootScopePhase(myWindow), "WaitForAngularDigestCycleToComplete").to.be.null;
            }
        });
    }

    WaitForAnimationsToStop(options = this.defaultOptions)
    {
        cy.get(":animated", options).should("not.exist");
    }

    getInjector(myWindow)
    {
        return myWindow.angular.element(myWindow.document.body).injector();
    }

     NumberOfPendingAngularRequests(myWindow)
    {
        return getInjector(myWindow).get('$http').pendingRequests;
    }

     AngularRootScopePhase(myWindow)
    {
        return getInjector(myWindow).get("$rootScope").$$phase;
    }
}
