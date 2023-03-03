import { createApolloClient } from "@teamhub/apollo-config";

const client = createApolloClient({
  env: process.env.K4_ENV,
  name: "integrations-page",
  logErrors: process.env.K4_ENV !== "production",
  cacheOptions: {
    typePolicies: {
      Query: {
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
