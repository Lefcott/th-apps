import React from "react";
import { Paper, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Logo from "../assets/k4community-logo.svg";
import styles from "./Container.module.css";
import Background from "../assets/background.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: `url(${Background})`,
    backgroundRepeat: "no-repeat",

    width: "100%",
    // overflowY: 'hidden',
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    flexDirection: "column",
  },
  paperArea: {
    marginLeft: "15%",
    padding: "45px 30px",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    width: "calc(75% - 15%)",
    maxWidth: "485px",
    height: "300px",
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 60px)",
      marginLeft: "0px",
      flexGrow: 1,
      maxWidth: "100%",
    },
  },
}));

export default function Container(props) {
  const classes = useStyles();

  return (
    <Box
      data-testid="CS_root"
      className={`${classes.root} ${styles.container}`}
    >
      <Paper className={classes.paperArea}>
        <Box
          component="img"
          src={Logo}
          alt="k4connect-logo"
          margin="0 auto"
          paddingBottom="45px"
          height="90px"
          width="286px"
        />
        {props.children}
      </Paper>
    </Box>
  );
}
