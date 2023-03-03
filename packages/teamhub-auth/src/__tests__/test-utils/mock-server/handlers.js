/** @format */

import { rest } from 'msw';
import generateFakeJwt, { mockSession } from './generateFakeJwt';
import { SSO_ENDPOINT, AUTH_ENDPOINT } from '../../../utils/environment';
export const validUser = {
  username: 'test-user@k4connect.com',
  password: 'Testpass123456',
};

function checkIfValidUser(email, password) {
  return email === validUser.username && password === validUser.password;
}
// we define the handlers here separately in case we want to use them
// in diff envs (service worker vs node server)
export const handlers = [
  // this mocks the fusionos auth request
  rest.post(`${AUTH_ENDPOINT}/`, async (req, res, ctx) => {
    //have to parse them out of the header
    const authorization = req.headers.get('authorization');
    if (authorization) {
      const parsedAuth = atob(authorization.split(' ')[1]).split(':');
      if (checkIfValidUser(parsedAuth[0], parsedAuth[1])) {
        return res(ctx.status(200), ctx.text(generateFakeJwt()));
      } else {
        return res(ctx.status(401));
      }
    } else {
      return res(ctx.status(401));
    }
  }),
  // mocking the sso request to refresh the httponly cookie
  rest.post(`${SSO_ENDPOINT}/auth/login`, async (req, res, ctx) => {
    const body = JSON.parse(req.body);
    const { email, password } = body;

    if (checkIfValidUser(email, password)) {
      // we don't use the return value here so its trivial whatever we return
      return res(
        ctx.cookie(mockSession.name, mockSession.value),
        ctx.json({ message: 'Success!' }),
      );
    } else {
      return res(ctx.status(401), ctx.json({ message: 'Not authorized' }));
    }
  }),

  rest.post(`${SSO_ENDPOINT}/users/password/forgot`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'success ' }));
  }),

  rest.post(`${SSO_ENDPOINT}/users/password/set`, async (req, res, ctx) => {
    try {
      const { token, password } = JSON.parse(req.body);
      if (token === 'goodtoken') {
        return res(ctx.status(200), ctx.json({ message: 'Success!' }));
      } else {
        return res(ctx.status(401), ctx.json({ message: 'Not authorized' }));
      }
    } catch (err) {
      res(ctx.status(500), ctx.json({ message: err }));
    }
  }),

  // validate token route
  rest.get(
    `${SSO_ENDPOINT}/users/password/reset/:token`,
    async (req, res, ctx) => {
      if (req.params.token !== 'goodtoken') {
        return res(ctx.status(4041));
      } else {
        return res(ctx.status(200));
      }
    },
  ),
];
