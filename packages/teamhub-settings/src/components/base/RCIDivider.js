import React from "react";

import { Divider, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: "16px 0",
    padding: "0 8px",
  },
}));

export default function RCIDivider() {
  const classes = useStyles();

  return (
    <Grid item justifycontent="center" xs={12}>
      <Divider className={classes.divider} />
    </Grid>
  );
}
