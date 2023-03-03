/** @format */

const QUERY_PARAMS = Cypress.config('queryParams');
const env = Cypress.env('ENVIRONMENT');
const url = Cypress.env('CYPRESS_BASE_URL')[env];

export const UrlOptions = {
  url,
  qs: QUERY_PARAMS[env],
  onBeforeLoad: (w) => {
    w.localStorage.setItem(
      'selectedCommunity',
      Cypress.env('communityId')[Cypress.env('K4_ENV')],
    );
  },
  onLoad: (w) => {
    try {
      if (env === 'local') {
        w.localStorage.setItem('devtools', true);
        w.importMapOverrides.addOverride(
          '@teamhub/resident-directory',
          `https://localhost:${Cypress.env(
            'PORT',
          )}/teamhub-resident-directory.js`,
        );
      }
    } catch (error) {
      console.log('___-_-_error_-_-___ :\n\n\n', error, '\n\n');
    }
  },
};
