import {
  _get, _post
} from './_api';
import { getCheckin, getUrl } from '../utilities/url.js';

const Reports = {
  getReportAuditEmail: async function getReportAuditEmail() {
    const { communityId, } = getUrl();
    const url = `${getCheckin()}/community/${communityId}/reports/emails`;
    return await _get(url);
  },

  postReportAuditEmail: async function postReportAuditEmail(id, body) {
    const { communityId, } = getUrl();
    const url = `${getCheckin()}/community/${communityId}/reports/emails`;
    return await _post(url, body);
  },

  getReportAudit: async function getReportAudit(query) {
    const { communityId, } = getUrl();
    const url = `${getCheckin()}/community/${communityId}/reports/audit`;
    const queryParams = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');

    return await _get(`${url}?${queryParams}`);
  },

  getReportAlerts: async function getReportAlerts(query) {
    const { communityId, } = getUrl();
    const url = `${getCheckin()}/community/${communityId}/reports/alerts`;

    if (query) {
      const queryParams = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');

      return await _get(`${url}?${queryParams}`);
    }
    return await _get(url);
  },
};

export default Reports;
