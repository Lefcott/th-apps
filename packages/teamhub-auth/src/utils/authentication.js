/** @format */

import { authStatus, getAuthToken, refetchCurrentUser } from '@teamhub/api';
import { SSO_ENDPOINT, AUTH_ENDPOINT } from './environment';
const defaultHeaders = {
  'content-type': 'application/json',
  accept: 'application/json',
};

/**
 * Function which handles logging into the k4 system
 * Fires two utility funcs for complete auth (since we are in the middle of migrating auth)
 * @param {String} email
 * @param {String} password
 */
export async function login(email, password) {
  const [jwtMessage] = await Promise.all([
    jwtLogin(email, password),
    ssoLogin(email, password),
  ]);
  // we refetch the user to bust the cache

  await refetchCurrentUser();
  authStatus.next({
    authToken: getAuthToken(),
    selectedCommunity: null,
    error: null,
  });
  return jwtMessage;
}

/**
 * Utility func for authenticating with the new jwt authentication service
 *
 * @param {String} email
 * @param {String} password
 */
async function jwtLogin(email, password) {
  const result = await fetch(`${AUTH_ENDPOINT}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${email}:${password}`)}`,
    },
  });

  if (result.ok) {
    const token = await result.text();
    const parsedToken = JSON.parse(atob(token.split('.')[1]));
    let { cookie, exp } = parsedToken;
    // for local development if you need a localhost token
    if (process.env.LOCAL == 'true') {
      cookie = cookie.replace('k4connect.com', '');
    } else {
      cookie = cookie.replace('k4connect.com', '.k4connect.com');
    }

    // set og cookie
    const cookieArr = cookie.split(';');
    cookieArr[0] = `jwt=${token}`;
    document.cookie = cookieArr.slice(0, 4).join(';');
    return 'success';
  } else if (result.status === 401) {
    return 'unauthorized';
  } else {
    throw new Error(`Error: ${status}`);
  }
}

/**
 * Utility func for authenticating with the old session based SSO route
 *
 * @param {String} email
 * @param {String} password
 */
async function ssoLogin(email, password) {
  try {
    const result = await fetch(`${SSO_ENDPOINT}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      // needed to ensure cookie from this endpoint gets set
      credentials: 'include',
    });
    const loggedInUser = await result.json();
    return loggedInUser;
  } catch (err) {
    return err;
  }
}

export async function validateToken(token) {
  try {
    const result = await fetch(
      `${SSO_ENDPOINT}/users/password/reset/${token}`,
      {
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      },
    );

    if (result.ok) {
      return 'validToken';
    } else {
      return 'invalidToken';
    }
  } catch (err) {
    throw new Error('Unable to validate token');
  }
}

export async function resetPassword(token, password) {
  const result = await fetch(`${SSO_ENDPOINT}/users/password/set`, {
    method: 'POST',
    // in the test env we send options preflight requests if we include headers,
    // which is completely not wanted and causes the handler to fail (we dont have a handler for options)
    headers: process.env.K4_ENV === 'test' ? {} : defaultHeaders,
    body: JSON.stringify({
      token,
      password,
    }),
  });
  if (result.ok) {
    return 'success';
  } else if (result.status === 401) {
    return 'invalidToken';
  } else {
    return 'error';
  }
}

export async function sendPasswordResetEmail(email) {
  try {
    const result = await fetch(`${SSO_ENDPOINT}/users/password/forgot`, {
      // in the test env we send options preflight requests if we include headers,
      // which is completely not wanted
      headers: process.env.K4_ENV === 'test' ? {} : defaultHeaders,
      body: JSON.stringify({ email, app: 'teamhub' }),
      method: 'POST',
    });
    if (result.ok) {
      // route doesn't return anything useful beyond a 200 to us
      // so returning a string to indicate success
      return 'success';
    } else {
      if (result.status === 404) {
        return 'not found';
      }
    }
  } catch (err) {
    throw new Error('Unable to send password reset email');
  }
}
