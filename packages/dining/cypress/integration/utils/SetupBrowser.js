/** @format */

const env = Cypress.env('ENVIRONMENT');
const QUERY_PARAMS = Cypress.config('queryParams');
const url = Cypress.env('CYPRESS_BASE_URL');

export const UrlOptions = {
  url,
  qs: QUERY_PARAMS[env],
  onBeforeLoad: (w) => {
    w.localStorage.setItem(
      'selectedCommunity',
      Cypress.env('communityId')[env]
    );
  },
  onLoad: (w) => {
    try {
      w.localStorage.setItem('devtools', true);
      if (env === 'local') {
        w.importMapOverrides.addOverride(
          '@teamhub/dining/', // slash really really?
          `https://localhost:${Cypress.env('PORT')}/teamhub-dining.js`
        );
        w.importMapOverrides.addOverride(
          '@teamhub/dining', // slash really really?
          `https://localhost:${Cypress.env('PORT')}/teamhub-dining.js`
        );
        cy.reload();
      }
    } catch (error) {
      console.log('___-_-_error_-_-___ :\n\n\n', error, '\n\n');
    }
  },
};
