/** @format */

import { createApolloClient } from "@teamhub/apollo-config";
const client = createApolloClient({
  serviceName: "resident-checki-in-ui",
  env: process.env.K4_ENV,
  useWs: true,
});

export default client;
