import {
  _get, _post, _delete
} from './_api';
import { getCheckin, getUrl } from '../utilities/url.js';

const UsersApi = {
  getUsers: async function getUsers(query) {
    const { communityId, } = getUrl();
    const url = `${getCheckin()}/community/${communityId}/users/`;

    if (query) {
      const queryParams = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
      return await _get(`${url}?${queryParams}`);
    }
    return await _get(url);
  },

  getUserStatus: async function getUserStatus(id) {
    const { communityId, } = getUrl();
    const userId = Object.keys(id).map(key => id[key]);
    const url = `${getCheckin()}/community/${communityId}/users/${userId}/status`;

    return await _get(url);
  },

  postUserStatus: async function postUserStatus(id, body) {
    const { communityId, } = getUrl();
    const userId = Object.keys(id).map(key => id[key]);
    const url = `${getCheckin()}/community/${communityId}/users/${userId}/status`;

	return await _post(url, body);
  },

  removeUserStatus: async function removeUserStatus(id){
	const { communityId } = getUrl();
	const userId = Object.keys(id).map(key => id[key]);
	const url = `${getCheckin()}/community/${communityId}/users/${userId}/status`;

	return await _delete(url);

  }

};

export default UsersApi;
