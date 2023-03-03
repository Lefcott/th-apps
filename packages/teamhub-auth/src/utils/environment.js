/** @format */

const environments = {
  sso: {
    dev: 'https://api-dev.k4connect.com/v2/sso',
    test: 'https://api-staging.k4connect.com/v2/sso',
    staging: 'https://api-staging.k4connect.com/v2/sso',
    production: 'https://api.k4connect.com/v2/sso',
    prod: 'https://api.k4connect.com/v2/sso',
  },
  tokenAuth: {
    dev: 'https://auth-v2-dev.k4connect.com',
    test: 'https://auth-v2-staging.k4connect.com',
    staging: 'https://auth-v2-staging.k4connect.com',
    production: 'https://auth-v2.k4connect.com',
    prod: 'https://auth-v2.k4connect.com',
  },
};

export const SSO_ENDPOINT = environments.sso[process.env.K4_ENV];
export const AUTH_ENDPOINT = environments.tokenAuth[process.env.K4_ENV];
