import React from "react";
import ReactDOM from "react-dom";
import {
  AppBar,
  Button,
  CircularProgress,
  Toolbar,
  Box,
  Divider,
  useMediaQuery,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { idGenerator } from "../utils";

const useStyles = makeStyles((theme) => ({
  appbar: {
    background: theme.palette.common.white,
  },
  toolbar: {
    height: 74,
    boxShadow: "0 0 0 1px #DCDCDC",
    [theme.breakpoints.down("sm")]: {
      height: "auto",
    },
  },
  firstButton: {
    marginRight: theme.spacing(2),
  },
  button: {
    [theme.breakpoints.down("sm")]: {
      minWidth: "auto",
    },
  },
  bar: {
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export default function TaskBar({ onSubmit, onCancel, loading, saveDisabled }) {
  const classes = useStyles();
  const idGen = idGenerator.createWithAppendedPrefix("TaskBar");

  return (
    <Box className={classes.bar} display="flex" justifyContent="flex-end">
      <Button
        id={idGen.getId("cancel")}
        disabled={loading}
        onClick={onCancel}
        className={[classes.button, classes.firstButton].join(" ")}
      >
        Cancel
      </Button>
      <Button
        id={idGen.getId("save")}
        className={classes.button}
        disabled={loading || saveDisabled}
        color="primary"
        variant="contained"
        onClick={onSubmit}
      >
        {loading ? <CircularProgress size={20} /> : "Save"}
      </Button>
    </Box>
  );
}

export function TaskBarPortal(props) {
  const elem = document.getElementById("teamhub-settings-taskbar-portal");
  return elem ? ReactDOM.createPortal(props.children, elem) : null;
}
