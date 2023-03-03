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
    w.localStorage.setItem('devtools', true);
  },
  onLoad: (w) => {
    try {
      if (env === 'local') {
        w.importMapOverrides.addOverride(
          '@teamhub/content-library/',
          `https://localhost:${Cypress.env('PORT')}/teamhub-content-library.js`
        );
        w.importMapOverrides.addOverride(
          '@teamhub/content-library',
          `https://localhost:${Cypress.env('PORT')}/teamhub-content-library.js`
        );
      }
    } catch (error) {
      console.log('___-_-_error_-_-___ :\n\n\n', error, '\n\n');
    }
  },
};
