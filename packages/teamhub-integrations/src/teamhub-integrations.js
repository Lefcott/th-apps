import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import client from "./apollo.config";
import Root from "./root";

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
});

const unmount = async (props) => {
  await lifecycles.unmount(props);
  client.resetStore();
};

export const { bootstrap, mount } = lifecycles;
export { unmount };
