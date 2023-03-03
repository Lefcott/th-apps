/** @format */

import React from "react";
import { TableHead, TableRow, TableCell } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useTableHeadStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.grey[100],
    width: "100%",
  },
}));

const useTableCellStyles = makeStyles((theme) => ({
  head: {
    fontSize: `${theme.spacing(1.75)}px !important`,
    color: theme.palette.grey[500],
    backgroundColor: theme.palette.common.white,
    padding: `${theme.spacing(1.5)}px ${theme.spacing(2)}px !important`,
    borderBottom: "0px solid transparent",
  },
}));

export default function BaseTableToolbar({ headerGroups, ...props }) {
  const tableHeadClasses = useTableHeadStyles();
  const tableCellClasses = useTableCellStyles();

  return (
    <TableHead classes={tableHeadClasses} {...props}>
      {headerGroups.map((headerGroup) => (
        <TableRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <TableCell classes={tableCellClasses} {...column.getHeaderProps()}>
              {column.render("Header")}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableHead>
  );
}
