/** @format */

import './set-public-path';
import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import client from './apollo.config';
import Root from './index';

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary() {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
});

export const unmount = async (props) => {
  await lifecycles.unmount(props);
  await client.resetStore();
};

export const { bootstrap, mount } = lifecycles;
