import React from "react";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "muicss/dist/css/mui.min.css";
import "./timeStr.es5.min";

export default function Root(props) {
  return (
    <RecoilRoot>
      <BrowserRouter basename="/forms">
        <App />
      </BrowserRouter>
    </RecoilRoot>
  );
}
