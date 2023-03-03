/** @format */

import React from "react";
import { Container, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const AppContainer = withStyles({
  root: {
    height: "calc(100% - 54px) !important",
    margin: "auto",
    padding: "24px 48px",
    "@media (max-width: 960px)": {
      margin: "0 !important",
      padding: "0 !important",
    },
  },
})(Container);

export default function BaseAppContainer({ children }) {
  return (
    <Box style={{ background: "#FAFAFA" }}>
      <AppContainer>{children}</AppContainer>;
    </Box>
  );
}
