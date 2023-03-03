/** @format */

import './set-public-path';
import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App';
import {
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles';
import 'regenerator-runtime/runtime';
import 'rc-swipeout/assets/index.css';
import './styles/styles.css';
import 'element-scroll-polyfill';
import { ApolloProvider } from '@teamhub/apollo-config';
import client from './apollo.config';

function AppWithProviders(props) {
  return (
    <StylesProvider
      generateClassName={createGenerateClassName({
        productionPrefix: 'teamhub-res-dir',
        seed: 'rd',
      })}
    >
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </StylesProvider>
  );
}

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: AppWithProviders,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
});

const unmount = async (props) => {
  await lifecycles.unmount(props);
  // to be safe
  client.resetStore();
};

export { unmount };
export const { bootstrap, mount } = lifecycles;
