/** @format */

import React from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    padding: "40px",
    display: "flex",
    overflow: "auto",
    paddingTop: "2rem",
    flexDirection: "column",
    backgroundColor: "#FAFAFA",
    height: "fill-available",
    maxWidth: "100%",

    [theme.breakpoints.down("sm")]: {
      padding: 0,
      paddingTop: theme.spacing(2),
    },
  },
}));

export default function BaseAppContainer({ children }) {
  const classes = useStyles();
  return <Container classes={classes}>{children}</Container>;
}
