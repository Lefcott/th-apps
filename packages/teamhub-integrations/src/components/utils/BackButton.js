import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  link: {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    textDecoration: "none",
    marginBottom: "10px",
  },
  backText: {
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0.15px",
    color: "rgba(0, 0, 0, 0.87)",
  },
  backArrow: {
    marginRight: "10px",
    color: theme.palette.text.primary,
  },
}));

export default function BackButton(props) {
  const classes = useStyles();

  return (
    <Link className={classes.link} to="/">
      <ArrowBack className={classes.backArrow} />
      <Typography className={classes.backText}>{props.children}</Typography>
    </Link>
  );
}
