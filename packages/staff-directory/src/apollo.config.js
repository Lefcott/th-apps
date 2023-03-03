/** @format */
import { createApolloClient } from '@teamhub/apollo-config';
const client = createApolloClient({
  env: process.env.K4_ENV,
  name: 'staff-directory',
  logErrors: process.env.K4_ENV !== 'production',
  useUploadClient: true,
});

export default client;
