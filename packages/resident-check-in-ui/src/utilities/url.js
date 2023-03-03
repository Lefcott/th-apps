import { get } from "lodash";

// default to dev if nothing specified
if (!process.env.K4_ENV) {
  process.env.K4_ENV = "dev";
}

const api = {
  dev: "https://api-dev.k4connect.com/v2/checkin",
  development: "https://api-dev.k4connect.com/v2/checkin",
  test: "https://api-test.k4connect.com/v2/checkin",
  staging: "https://api-staging.k4connect.com/v2/checkin",
  production: "https://api.k4connect.com/v2/checkin",
};

export function getCheckin() {
  const env = process.env.K4_ENV;
  const url = `${api[env]}`;
  return url;
}

export function getUrl() {
  const searchParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const p of searchParams) {
    params[p[0]] = p[1];
  }
  return params;
}

//modified to allow passing a default value if missing (better error handling)
export function getOneSearchParam(paramName, defaultValue = "") {
  const urlParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlParams.entries());
  const fetched = get(params, paramName, defaultValue);

  if (fetched === "") {
    console.warn(`Unable to find param "${paramName}" in url.`);
  }
  return fetched.replace(/\/$/, "") || defaultValue;
}

export const isUrl = (url) => url && url.indexOf("http") > -1;
