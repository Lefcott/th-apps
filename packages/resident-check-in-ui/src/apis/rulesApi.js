import {
  _get, _post, _put, _delete
} from './_api';
import { getCheckin } from '../utilities/url.js';

const Rules = {
  getRulesRun: async function getRulesRun(query) {
    const { communityId, } = getUrl();
    const url = `${getCheckin()}/community/${communityId}/rules/run`;
    const queryParams = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');

    return await _get(`${url}?${queryParams}`);
  },

  getRules: async function getRules(query) {
    const { communityId, } = getUrl();
    const url = `${getCheckin()}/community/${communityId}/rules`;

    if (query) {
      const queryParams = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');

      return await _get(`${url}?${queryParams}`);
    }
    return await _get(url);
  },

  postRules: async function postRules(id, body) {
    const { communityId, } = getUrl();
    const url = `${getCheckin()}/community/${communityId}/rules`;
    return await _post(url, body);
  },

  postRules: async function postRules(id, body) {
    const { communityId, } = getUrl();
    const ruleId = Object.keys(id).map(key => id[key]);
    const url = `${getCheckin()}/community/${communityId}/rules/${ruleId}`;

    return await _post(url, body);
  },

  deleteRules: async function deleteRules(id) {
    const { communityId, } = getUrl();
    const ruleId = Object.keys(id).map(key => id[key]);
    const url = `${getCheckin()}/community/${communityId}/rules/${ruleId}`;

    return await _delete(url);
  },
};

export default Rules;
