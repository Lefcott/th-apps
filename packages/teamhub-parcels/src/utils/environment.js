/** @format */

function apiEnvs(scheme, endpoint) {
  return {
    local: process.env.PAPI_DOMAIN
      ? `${scheme}://${process.env.PAPI_DOMAIN}/${endpoint}`
      : `${scheme}://graph-staging.k4connect.com/${endpoint}`,
    dev: `${scheme}://graph-dev.k4connect.com/${endpoint}`,
    staging: `${scheme}://graph-staging.k4connect.com/${endpoint}`,
    production: `${scheme}://graph.k4connect.com/${endpoint}`
  }
}

export function loadApiUrl(scheme, endpoint) {
  return apiEnvs(scheme, endpoint)[process.env.K4_ENV || 'local']
}
