/** @format */

import { _get, _post, _put, _delete } from './api';
import { getDocumentBase } from '../utilities/url-service';
import { getOneSearchParam } from '@teamhub/api';

function formatQueryParams(params) {
  const queryParams = new URLSearchParams();
  Object.entries(params).map(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => queryParams.append(key, val));
    } else {
      queryParams.set(key, value);
    }
  });

  return queryParams;
}

const ManagerApi = {
  getSchedule: (query) => {
    let url = `${getDocumentBase()}/manage/schedule`;
    if (query) {
      url += `?${formatQueryParams(query).toString()}`;
    }
    return _get(url);
  },

  deleteSchedule: (query) => {
    let url = `${getDocumentBase()}/manage/schedule`;
    if (query) {
      url += `?${formatQueryParams(query).toString()}`;
    }
    return _delete(url);
  },

  //These are for examples currently
  postSchedule: (body) => {
    let url = `${getDocumentBase()}/manage/schedule`;

    return _post(url, body);
  },

  putTest: (id, body) => {
    const { communityId } = getOneSearchParam('communityId');
    const userId = Object.keys(id).map((key) => id[key]);
    const url = `${getDocumentBase()}/community/${communityId}/users/${userId}/status`;
    return _put(url, body);
  },
};

export default ManagerApi;
