/** @format */

import { createApolloClient, makeVar } from '@teamhub/apollo-config';

const activeResidentVar = makeVar(null);

const client = createApolloClient({
  useUploadClient: true,
  env: process.env.K4_ENV,
  name: 'resident-directory',
  cacheOptions: {
    typePolicies: {
      Query: {
        fields: {
          community: {
            merge: true,
          },
          activeId: {
            read() {
              return activeResidentVar();
            },
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
export { activeResidentVar };
