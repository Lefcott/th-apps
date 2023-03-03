import 'core-js/stable';
import 'whatwg-fetch';
import React from 'react';
import App from './App';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import client from './apollo.config.js';
import { ApolloProvider } from '@teamhub/apollo-config';

export default function Root(props) {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}
