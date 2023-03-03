import React from "react";
import PropTypes from "prop-types";
import {
  Dialog as MaterialDialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  dialogPaper: { width: 500 },
};

function Dialog(props) {
  return (
    <MaterialDialog
      fullScreen={props.fullScreen}
      open={props.open}
      onClose={props.onClose}
      classes={{ paper: props.classes.dialogPaper }}
      disableBackdropClick={props.disableBackdropClick}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent dividers style={props.contentStyle}>
        {props.content}
      </DialogContent>
      <DialogActions>{props.actions}</DialogActions>
    </MaterialDialog>
  );
}

Dialog.propTypes = {
  style: PropTypes.object,
  open: PropTypes.bool,
  disableBackdropClick: PropTypes.bool,
};

export default withStyles(styles)(Dialog);
