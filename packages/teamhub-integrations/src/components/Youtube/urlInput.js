import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import { Clear } from "@material-ui/icons";

export default function Url(props) {
  const { clear, onChange, value, error } = props;

  const [hide, setHide] = useState(false);

  const toggle = () => {
    setHide(!hide);
  };

  return (
    <TextField
      id="MS-youtube-playlist-input"
      variant="outlined"
      label="Youtube Playlist"
      autoComplete={"off"}
      fullWidth={true}
      onChange={onChange}
      value={value}
      error={error}
      helperText={error && "Please enter a valid YouTube Playlist URL."}
      onMouseLeave={toggle}
      onMouseEnter={toggle}
      InputProps={{
        "data-testid": "MS-youtube-playlist-input",
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="clear" onClick={clear}>
              {hide && <Clear />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
