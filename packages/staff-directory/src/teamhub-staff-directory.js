/** @format */

import './set-public-path';
import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import Root from './Root';
import client from './apollo.config.js';

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
});

export const unmount = async (props) => {
  await lifecycles.unmount(props);
  client.resetStore();
};

export const { bootstrap, mount } = lifecycles;
