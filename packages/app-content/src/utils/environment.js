/** @format */

const unfurlerUrls = () => {
  return {
    local: 'https://content-serverless.k4connect.com/dev/v1/unfurl',
    development: 'https://content-serverless.k4connect.com/dev/v1/unfurl',
    staging: 'https://content-serverless.k4connect.com/staging/v1/unfurl',
    production: 'https://content-serverless.k4connect.com/production/v1/unfurl',
    test: 'https://content-serverless.k4connect.com/test/v1/unfurl', // for unit testing purpose
  };
};

export function getUnfurlerUrl() {
  const env = process.env.K4_ENV || 'local';
  return unfurlerUrls()[env];
}
