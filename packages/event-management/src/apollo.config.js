/** @format */
import { createApolloClient } from '@teamhub/apollo-config';
const client = createApolloClient({
  name: 'events-management',
  env: process.env.K4_ENV,
  debounce: true,
  logErrors: true,
  cacheOptions: {
    typePolicies: {
      Query: {
        fields: {
          community: {
            merge: false,
          },
        },
      },
    },
  },
});

export default client;
