/** @format */
import '@testing-library/jest-dom/extend-expect';
import fetch from 'node-fetch';

// eslint-disable-next-line no-undef
if (!globalThis.fetch) {
  // eslint-disable-next-line no-undef
  globalThis.fetch = fetch;
}
import { server } from './__mocks__/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
