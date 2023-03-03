import React from "react";
import { AppBar, Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  bottomActionBar: {
    top: "auto",
    bottom: 0,
    padding: "15px",
    backgroundColor: "white",
    display: "flex",
  },
  button: {
    margin: "0 5px",
    padding: "8px 40px",
  },
}));

export default function ActionBar(props) {
  const { update, cancel, isEdit } = props;
  const { bottomActionBar, button } = useStyles();

  return (
    <AppBar
      position="fixed"
      testid="MS-youtube-playlist-action-bar"
      className={bottomActionBar}
    >
      <Grid container justify="flex-end" width={1}>
        <Button
          className={button}
          onClick={cancel}
          testid="MS-youtube-playlist-cancel"
          id="MS-youtube-playlist-cancel"
        >
          Cancel
        </Button>
        <Button
          className={button}
          testid="MS-youtube-playlist-update"
          id="MS-youtube-playlist-update"
          variant="contained"
          color="primary"
          onClick={update}
        >
          {isEdit ? "Update" : "Post"}
        </Button>
      </Grid>
    </AppBar>
  );
}
