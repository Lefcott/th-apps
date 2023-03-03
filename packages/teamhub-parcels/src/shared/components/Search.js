import React from "react";
import {
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Search as SearchMui, ClearOutlined } from "@material-ui/icons";

const useOutlinedInputStyles = makeStyles((theme) => ({
  root: {
    outline: "none",
    "&:hover, &:focus, &:active": {
      color: theme.palette.secondary.main,
      backgroundColor: "rgba(76, 67, 219, 0.05)",
      border: "none",

      "& svg": {
        color: `${theme.palette.secondary.main} !important`,
      },

      "& fieldset": {
        border: `2px solid ${theme.palette.secondary.main} !important`,
        borderColor: `${theme.palette.secondary.main} !important`,
      },
    },
  },
}));

export default function Search({
  genId,
  placeholder,
  value,
  onChange,
  loading,
}) {
  const outlinedInputClasses = useOutlinedInputStyles();
  function handleChange(ev) {
    const { value } = ev.target;
    onChange(value);
  }

  function clearSearch() {
    onChange("");
  }

  function getAdornment() {
    let icon;

    if (loading) {
      icon = <CircularProgress color="secondary" size={20} />;
    } else if (value) {
      icon = <ClearOutlined />;
    } else {
      icon = <SearchMui />;
    }

    return (
      <InputAdornment position="end">
        <IconButton size="small" onClick={clearSearch}>
          {icon}
        </IconButton>
      </InputAdornment>
    );
  }

  return (
    <TextField
      classes={outlinedInputClasses}
      id={genId("search")}
      fullWidth
      color="secondary"
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
      variant="outlined"
      InputProps={{
        endAdornment: getAdornment(),
      }}
    />
  );
}
