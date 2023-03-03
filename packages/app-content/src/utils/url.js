/** @format */

import { get } from 'lodash';

// this does require a polyfill for IE 11, see dependencies for resident-check-in-ui
export function getAllSearchParams() {
  const searchParams = new URLSearchParams(window.location.search);
  let params = {};
  for (const p of searchParams) {
    params[p[0]] = p[1];
  }
  return params;
}

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
