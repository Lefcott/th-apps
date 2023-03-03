/** @format */
import 'url-search-params-polyfill';
import '@testing-library/jest-dom/extend-expect';

import { server } from './test-utils/mock-server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
