import { createApolloClient } from '@teamhub/apollo-config';
const client = createApolloClient({
  useWs: true,
  env: process.env.K4_ENV,
  name: 'content-library',
  logErrors: process.env.K4_ENV !== 'production',
  cacheOptions: {
    typePolicies: {
      Query: {
        fields: {
          community: {
            merge: true,
          },
        },
      },
      Mutation: {
        fields: {
          community: {
            merge: true,
          },
        },
      },
    },
  },
});

export default client;
