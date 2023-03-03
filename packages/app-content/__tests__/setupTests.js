/** @format */
import '@testing-library/jest-dom/extend-expect';
require('jest-fetch-mock').enableMocks();

jest.mock('@teamhub/apollo-config', () => ({
  ...jest.requireActual('@teamhub/apollo-config'),
  useQuery: (query, options) =>
    jest.requireActual('@teamhub/apollo-config').useQuery(query, {
      ...options,
      fetchPolicy: 'no-cache',
    }),
  useLazyQuery: (query, options) =>
    jest.requireActual('@teamhub/apollo-config').useLazyQuery(query, {
      ...options,
      fetchPolicy: 'no-cache',
    }),
}));
