/** @format */

import { createApolloClient } from '@teamhub/apollo-config';
const client = createApolloClient({
  serviceName: 'data-export',
  env: process.env.K4_ENV,
  useWs: true,
});
export default client;
