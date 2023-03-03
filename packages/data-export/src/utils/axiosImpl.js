import axios from 'axios';

import { getAuthToken } from '@teamhub/api';

/**
 * Simple helper function to make requests using Axios/Axios-retry
 *
 * @param {String} url The request string
 * @param {Function} successCB Callback when request is successful
 * @param {Function} failureCB Callback when request failes
 */
export default function axiosImpl(
  path,
  queryString,
  successCB,
  failureCB,
  maxRetries = 3
) {
  const continueRetryError = 'CONTINUE WAIT';
  let retryCount = 0;

  // Gets the user auth token
  const getToken = () => {
    const token = getAuthToken();
    return token;
  };

  const buildEndpoint = () => {
    const env = process.env.K4_ENV;
    return `https://api-${env}.k4connect.com${path}${queryString}`;
  };

  // Interceptor to process the reponse
  // this is the only way to validate a 200 response
  axios.interceptors.response.use(
    function (response) {
      const ucError = response.data.error
        ? response.data.error.toUpperCase()
        : response?.data?.error;

      // uncomment to test
      // if (retryCount < 2) {
      //   return Promise.reject(continueRetryError);
      // }
      if (response.status === 200 && ucError === continueRetryError) {
        return Promise.reject(ucError);
      }
      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // Uses axios to make the request
  const getRequest = () => {
    const token = getToken();
    const endPoint = buildEndpoint();
    axios({
      method: 'get',
      url: endPoint,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        successCB(response);
      })
      .catch((error) => {
        if (error === continueRetryError && retryCount < maxRetries) {
          retryCount++;
          setTimeout(() => getRequest(), 1000);
        } else {
          failureCB(error);
        }
      });
  };

  getRequest();
}
