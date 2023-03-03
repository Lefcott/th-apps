/** @format */

import React, { useState } from "react";
import { useTimeoutFn } from "react-use";
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Search, Clear } from "@material-ui/icons";
import BaseLoader from "../BaseLoader";

const useStyles = makeStyles((theme) => ({
  root: {
    outline: "none",
    flex: 1,
    paddingLeft: 0,
  },
}));

const useOutlinedInputStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.common.white,
    borderColor: "#F5F5F5",
    outline: "none",
    borderRadius: theme.spacing(0.5),
    "&:hover, &:focus, &:active": {
      color: theme.palette.primary.main,
      backgroundColor: "rgba(76, 67, 219, 0.05)",
      border: "none",

      "& svg": {
        color: `${theme.palette.primary.main} !important`,
      },

      "& fieldset": {
        borderColor: `${theme.palette.primary.main} !important`,
      },
    },
  },
  input: {
    padding: "18.5px 14px 18.5px",
  },
}));

const useAdornmentStyles = makeStyles((theme) => ({
  positionEnd: {
    paddingRight: theme.spacing(1),
  },
}));

const useIconButtonStyles = makeStyles((theme) => ({
  root: {
    "&:hover": {
      backgroundColor: "transparent !important",
    },
  },
}));

const WAIT_TIMEOUT_DURATION = 1000;
const SINGLE_SPACE_REGEX = /^\s$/;

function BaseSearchBar({ placeholder, onChange, ...props }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const outlinedInputClasses = useOutlinedInputStyles();
  const adornmentClasses = useAdornmentStyles();
  const iconButtonClasses = useIconButtonStyles();

  const [, , resetLoadingTimeout] = useTimeoutFn(() => {
    // expected behavior: first single space counts as an empty string
    if (!search.match(SINGLE_SPACE_REGEX)) {
      onChange(search);
    }
    setLoading(false);
  }, WAIT_TIMEOUT_DURATION);

  function onSearchChange(value) {
    setLoading(true);
    resetLoadingTimeout();
    return setSearch(value);
  }

  function getInputAdornment() {
    let icon;
    if (loading) {
      icon = <BaseLoader id={`${props.id}-adornment-loading`} />;
    } else if (search.length) {
      icon = (
        <Clear
          id={`${props.id}-adornment-clear`}
          style={{ cursor: "pointer" }}
        />
      );
    } else {
      icon = <Search id={`${props.id}-adornment-search`} />;
    }

    return (
      <IconButton
        disableRipple
        aria-label="searchbar-adornment"
        classes={iconButtonClasses}
        onClick={() => onSearchChange("")}
      >
        {icon}
      </IconButton>
    );
  }

  const startAdornment = (
    <InputAdornment classes={adornmentClasses} position="end">
      {getInputAdornment()}
    </InputAdornment>
  );

  return (
    <TextField
      fullWidth
      value={search}
      classes={classes}
      variant="outlined"
      placeholder={placeholder}
      onChange={(ev) => onSearchChange(ev.target.value)}
      inputProps={{
        role: "searchbar",
      }}
      InputProps={{
        startAdornment,
        classes: outlinedInputClasses,
      }}
      {...props}
    />
  );
}

export default BaseSearchBar;
