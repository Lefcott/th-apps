/** @format */

import { createApolloClient } from '@teamhub/apollo-config';
const client = createApolloClient({
  serviceName: 'post-manager',
  env: process.env.K4_ENV,
  useWs: true,
  cacheOptions: {
    typePolicies: {
      Query: {
        fields: {
          community: {
            merge: true,
          },
        },
      },
      Community: {
        fields: {
          feed: {
            keyArgs: false,
            merge(existing, incoming, { args }) {
              const merged = Object.assign({}, existing, {
                posts: incoming.posts,
                pageInfo: incoming.pageInfo,
              });
              return merged;
            },
          },
        },
      },
    },
  },
});
export default client;
