/** @format */

import React from "react";
import { TableBody } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
  },
}));

export default function BaseTableBody({ children, tableBodyProps }) {
  const classes = useStyles();
  return (
    <TableBody classes={classes} {...tableBodyProps}>
      {children}
    </TableBody>
  );
}
