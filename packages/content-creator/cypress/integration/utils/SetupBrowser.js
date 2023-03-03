/** @format */

const env = Cypress.env('ENVIRONMENT');
const QUERY_PARAMS = Cypress.config('queryParams');
const url = Cypress.env('CYPRESS_BASE_URL')[env];
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
      if (env === 'local') {
        w.localStorage.setItem('devtools', true);
        w.importMapOverrides.addOverride(
          '@teamhub/content-creator/',
          `https://localhost:${Cypress.env('PORT')}/teamhub-content-creator.js`
        );
        w.importMapOverrides.addOverride(
          '@teamhub/content-creator',
          `https://localhost:${Cypress.env('PORT')}/teamhub-content-creator.js`
        );
      }
    } catch (error) {
      console.log('___-_-_error_-_-___ :\n\n\n', error, '\n\n');
    }
  },
};
