import React from "react";
import { useMediaQuery, Fab } from "@material-ui/core";
import { Save } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { StyledButton, Portal } from "./controls";

export default function SaveButton(props) {
  const isMobile = useMediaQuery("(max-width:960px)");
  const { classes } = props;

  if (isMobile) {
    return (
      <>
        <Fab
          className={classes.fab}
          color="primary"
          variant="extended"
          onClick={props.handleSave}
        >
          Save Form
        </Fab>
      </>
    );
  } else {
    return (
      <Portal>
        <StyledButton
          id="F_toolbar-cancel"
          margin="left"
          onClick={props.handleCancel}
        >
          Cancel
        </StyledButton>
        <StyledButton
          id="F_toolbar-save"
          color="primary"
          variant="contained"
          margin="left"
          onClick={props.handleSave}
        >
          Save
        </StyledButton>
      </Portal>
    );
  }
}
