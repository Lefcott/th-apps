import React from "react";
import { Button, Typography } from "@material-ui/core";
import broken from "./towing.svg";
import { getCommunityId } from "@teamhub/api";
import {
  StylesProvider,
  ThemeProvider,
  createGenerateClassName,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: { useNextVariants: true },
  palette: {
    primary: { main: "#4c43db" },
    secondary: { main: "#cc4c3b" },
  },
});

const useStyles = makeStyles((theme) => ({
  brokenContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  largePadding: {
    paddingBottom: "40px",
  },
  medPadding: {
    paddingBottom: "20px",
  },
}));

export default function Root(props) {
  const { singleSpa } = props;
  const classes = useStyles();
  const goHome = () =>
    singleSpa.navigateToUrl(`/?communityId=${getCommunityId()}`);
  return (
    <StylesProvider
      generateClassName={createGenerateClassName({
        productionPrefix: "th-error",
      })}
    >
      <ThemeProvider theme={theme}>
        <div className={classes.brokenContainer}>
          <div className={classes.innerContainer}>
            <img className={classes.largePadding} src={broken}></img>
            <Typography className={classes.medPadding}>
              This page doesn't seem to be working
            </Typography>
            <Button color="primary" variant="contained" onClick={goHome}>
              Go Home
            </Button>
          </div>
        </div>
      </ThemeProvider>
    </StylesProvider>
  );
}
