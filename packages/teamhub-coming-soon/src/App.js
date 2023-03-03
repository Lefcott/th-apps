/** @format */

import React from "react";
import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Container from "./components/Container";
import { useFlags, getCommunityId } from "@teamhub/api";

export default function App(props) {
  const flags = useFlags();
  if (flags && flags.teamhubAccess) {
    props.singleSpa.navigateToUrl(`/?communityId=${getCommunityId()}`);
  }
  return (
    <StylesProvider
      generateClassName={createGenerateClassName({
        productionPrefix: "coming-soon",
        seed: "coming-soon",
      })}
    >
      <Container>
        <Typography paragraph>You got here early!</Typography>
        <Typography paragraph>
          A new K4Community Team Hub is coming soon.
        </Typography>
      </Container>
    </StylesProvider>
  );
}
