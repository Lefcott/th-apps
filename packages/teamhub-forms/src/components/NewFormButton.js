import React from "react";
import { useMediaQuery, Fab } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { StyledButton, Portal } from "./controls";

export default function NewFormButton(props) {
  const isMobile = useMediaQuery("(max-width:960px)");
  const { classes } = props;
  const history = useHistory();

  const handleNewClick = (event) => {
    history.push("/builder");
  };

  if (isMobile) {
    return (
      <>
        <Fab
          className={classes.fab}
          variant="extended"
          color="primary"
          onClick={handleNewClick}
        >
          New Form
        </Fab>
      </>
    );
  } else {
    return (
      <Portal>
        <StyledButton
          id="F_toolbar-new"
          color="primary"
          variant="contained"
          margin="left"
          onClick={handleNewClick}
        >
          New Form
        </StyledButton>
      </Portal>
    );
  }
}
