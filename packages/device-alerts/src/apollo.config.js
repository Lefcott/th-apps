/** @format */
import { createApolloClient } from "@teamhub/apollo-config";

const client = createApolloClient({
  env: process.env.K4_ENV,
  name: "device-alerts",
  logErrors: true,
});

export default client;
