/** @format */

import './set-public-path';
import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import Root from './root';
import client from './apollo.config';

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary(err) {
    // Customize the root error boundary for your microfrontend here.
    console.log('error', err);
    return null;
  },
});

export const unmount = async (props) => {
  await lifecycles.unmount(props);
  client.resetStore();
};

export const { bootstrap, mount } = lifecycles;
