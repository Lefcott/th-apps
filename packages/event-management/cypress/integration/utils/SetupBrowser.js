/** @format */

const env = Cypress.env('ENVIRONMENT');
const QUERY_PARAMS = Cypress.config('queryParams');
const url = Cypress.env('CYPRESS_BASE_URL')[env];
export const UrlOptions = {
  url,
  qs: QUERY_PARAMS[env],
  onLoad: (w) => {
    try {
      w.localStorage.setItem(
        'selectedCommunity',
        QUERY_PARAMS[env].communityId,
      );
      w.localStorage.setItem('devtools', true);
      if (env === 'local') {
        w.importMapOverrides.addOverride(
          '@teamhub/event-management', // slash really really?
          `https://localhost:${Cypress.env(
            'PORT',
          )}/teamhub-event-management.js`,
        );
        w.importMapOverrides.addOverride(
          '@teamhub/event-management/', // slash really really?
          `https://localhost:${Cypress.env(
            'PORT',
          )}/teamhub-event-management.js`,
        );
        cy.reload();
      }
    } catch (error) {
      console.log('___-_-_error_-_-___ :\n\n\n', error, '\n\n');
    }
  },
};
