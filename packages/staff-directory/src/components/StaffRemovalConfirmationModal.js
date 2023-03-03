/** @format */

import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';

function generateId(component) {
  return `SD_StaffRemovalConfirmationModal-${component}`;
}

export default function StaffRemovalConfirmationModal({
  open,
  onCancel,
  onConfirm,
  staff,
}) {
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{`Remove ${staff?.firstName}?`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Deleting will permanently remove ${staff?.fullName} from the Staff Directory.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button id={generateId('action-cancel')} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          id={generateId('actionsremove')}
          onClick={onConfirm}
          color="secondary"
        >
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
}
