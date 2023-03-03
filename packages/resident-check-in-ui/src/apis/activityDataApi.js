import {
  _get, _post, _put, _delete
} from './_api';
import { getCheckin, getUrl } from '../utilities/url.js';

const ActivityData = {
  getActivity: async function getActivity(query) {
    const queryParams = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
    const url = `${getCheckin()}/activity/system`;
    return await _get(`${url}?${queryParams}`);
  },

  postActivity: async function postActivity(id, body) {
    const url = `${getCheckin()}/activity/system`;
    return await _post(url, body);
  },

  getCheckinActivity: async function getActivity(query) {
    const { communityId, } = getUrl();
    const queryParams = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
    const url = `${getCheckin()}/activity/checkin`;
    try{
      return await _get(`${url}?${queryParams}&communityId=${communityId}`);
    } catch(e) {
      console.log(e)
    }
    
  },

};

export default ActivityData;
