/** @format */

import 'url-search-params-polyfill';
import { get } from 'lodash';
const baseUrls = {
  local: 'https://api-staging.k4connect.com/v2',
  dev: 'https://api-dev.k4connect.com/v2',
  test: 'https://api-test.k4connect.com/v2',
  staging: 'https://api-staging.k4connect.com/v2',
  production: 'https://api.k4connect.com/v2',
};

export const getUrl = (service) => {
  // default to local if we have no node env
  const env = process.env.K4_ENV || 'local';

  const base = baseUrls[env];

  return `${base}/${service}`;
};

export const getSSOBase = () => getUrl('sso');
export const getDocumentBase = () => getUrl('document');

//modified to allow passing a default value if missing (better error handling)
export function getOneSearchParam(
  paramName,
  defaultValue = '',
  search = window.location.search,
) {
  const urlParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlParams.entries());
  const fetched = get(params, paramName, defaultValue);

  if (fetched === '') {
    console.warn(`Unable to find param "${paramName}" in url.`);
  }
  return fetched || defaultValue;
}
