/** @format */

const ENV = Cypress.env('ENVIRONMENT');
const SSO_URL = Cypress.config('SSO_AUTH_URL')[ENV];

Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.exec(`sh ./generateToken.sh ${email} ${password} ${ENV}`).then((res) => {
      let jwt = res.stdout;
      cy.setCookie('jwt', jwt, { domain: 'k4connect.com' });
    });

    cy.request('POST', SSO_URL, { email, password }).then((res) => {
      let session = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
      cy.setCookie('session', session, { domain: 'k4connect.com' });
    });
  });
});

Cypress.on('window:before:load', (window) => {
  window.localStorage['selectedCommunity'] = Cypress.env('selectedCommunity');
  if (ENV === 'local') {
    window.localStorage.setItem('devtools', true);
    window.importMapOverrides.addOverride(
      '@teamhub/auth/',
      `https://localhost:${Cypress.env('PORT')}/teamhub-auth.js`,
    );
    window.importMapOverrides.addOverride(
      '@teamhub/auth',
      `https://localhost:${Cypress.env('PORT')}/teamhub-auth.js`,
    );
    // cy.reload();
  }
});

// If SLOW env variable is true, add a delay between commands to make them "human speed"
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

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});
