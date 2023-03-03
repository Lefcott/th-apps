/** @format */

import { _get } from './api';
import { getDocumentBase } from '../utilities/url-service';

const DocumentApi = {
  getRecents: (query) => {
    let url = `${getDocumentBase()}/document`;
    if (query) {
      const params = Object.keys(query)
        .map((key) => `${key}=${query[key]}`)
        .join('&');
      url += `?${params}`;
    }
    return _get(url);
  },
  getOne: (id) => _get(`${getDocumentBase()}/document/${id}`),
};

export default DocumentApi;
