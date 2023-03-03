/** @format */

import { createApolloClient } from '@teamhub/apollo-config';
const client = createApolloClient({
  serviceName: 'dining',
  env: process.env.K4_ENV,
  useWs: true,
});
export default client;
