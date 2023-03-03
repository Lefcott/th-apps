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
      Cypress.env('communityId')[env],
    );
  },
  onLoad: (w) => {
    try {
      w.localStorage.setItem('devtools', true);
      if (env === 'local') {
        w.importMapOverrides.addOverride(
          '@teamhub/staff-directory/',
          `https://localhost:${Cypress.env('PORT')}/teamhub-staff-directory.js`,
        );
        w.importMapOverrides.addOverride(
          '@teamhub/staff-directory',
          `https://localhost:${Cypress.env('PORT')}/teamhub-staff-directory.js`,
        );
      }
    } catch (error) {
      console.log('___-_-_error_-_-___ :\n\n\n', error, '\n\n');
    }
  },
};
