import React from "react";
import { Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto 0.25rem",
    paddingLeft: theme.spacing(1),
    fontWeight: "normal",
  },
  clickableColorPrimary: {
    color: ({ active }) =>
      active ? theme.palette.primary.main : theme.palette.common.black,
    backgroundColor: ({ active }) => (active ? "#EDEDFB" : "#e0e0e0"),
    "&:hover": {
      backgroundColor: ({ active }) => (active ? "#EDEDFB" : "#e0e0e0"),
    },
    "&:focus": {
      backgroundColor: ({ active }) => (active ? "#EDEDFB" : "#e0e0e0"),
    },
  },
}));

export default function AlertTypeFilterChip({ active, id, ...props }) {
  const classes = useStyles({ active });
  return (
    <Chip
      aria-label={`filter-chip-${id}`}
      aria-checked={active}
      classes={classes}
      color={active ? "primary" : "default"}
      id={`DA)_filter-chip-${id}`}
      {...props}
    />
  );
}
