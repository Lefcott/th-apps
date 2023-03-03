import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import ParcelProvider from "@provider";
import InsertionModal from "./components/InsertionModal";

function Root(props) {
  return (
    <ParcelProvider>
      <InsertionModal {...props} />
    </ParcelProvider>
  );
}

const singleSpaReactLifeCycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
});

const { bootstrap, mount, unmount } = singleSpaReactLifeCycles;

export default { bootstrap, mount, unmount };
