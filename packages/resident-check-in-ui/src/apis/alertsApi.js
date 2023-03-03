import {
  _get, _put
} from './_api';
import { getCheckin, getUrl } from '../utilities/url.js';

const AlertsApi = {
  getAlerts: async function getAlerts(query) {
    const { communityId, } = getUrl();
    const url = `${getCheckin()}/community/${communityId}/alerts`;

    if (query) {
      const queryParams = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
      return await _get(`${url}?${queryParams}`);
    }
    return await _get(url);
  },

  putAlerts: async function putAlerts(alertId, body) {
    const url = `${getCheckin()}/community/alerts/${alertId}`;
    return await _put(url, body);
  },
  
  getAudits: async function getAudits(alertId) {
    const url = `${getCheckin()}/alert/${alertId}/audits`;
    return await _get(url);
  }
};

export default AlertsApi;
