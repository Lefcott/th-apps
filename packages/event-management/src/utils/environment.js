/** @format */

const apiEnvs = {
  local: 'https://api-staging.k4connect.com/v3/graph/graphql',
  dev: 'https://api-dev.k4connect.com/v3/graph/graphql',
  test: 'https://api-staging.k4connect.com/v3/graph/graphql',
  staging: 'https://api-staging.k4connect.com/v3/graph/graphql',
  production: 'https://api.k4connect.com/v3/graph/graphql',
};

const unfurlerUrls = {
  local: 'https://content-serverless.k4connect.com/dev/v1/unfurl',
  dev: 'https://content-serverless.k4connect.com/dev/v1/unfurl',
  staging: 'https://content-serverless.k4connect.com/staging/v1/unfurl',
  production: 'https://content-serverless.k4connect.com/production/v1/unfurl',
  test: 'https://content-serverless.k4connect.com/test/v1/unfurl',
};

export function getUnfurlerUrl() {
  const url = unfurlerUrls[process.env.K4_ENV];
  return url;
}

export function loadApiUrl(env) {
  return apiEnvs[env || process.env.K4_ENV];
}

export function getCookie(name) {
  // if we are developing locally, we want to send this token, since
  // we cannot access the usual token from the browser
  var value = '; ' + document.cookie;
  var parts = value.split('; ' + name + '=');
  if (parts.length === 2) return parts.pop().split(';').shift();
}
