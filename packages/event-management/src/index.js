/** @format */

import React from 'react';
import App from './App';
import 'rc-swipeout/assets/index.css';
import client from './apollo.config.js';
import { ApolloProvider } from '@teamhub/apollo-config';
export default function Root() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}
