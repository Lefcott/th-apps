/** @format */

import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const DeleteDialog = withStyles({
  paperWidthXs: {
    maxWidth: '400px',
  },
})(Dialog);

const DeleteDialogTitle = withStyles((theme) => ({
  root: {
    '& h2': {
      fontSize: '20px',
      color: theme.palette.text.highEmphasis,
    },
  },
}))(DialogTitle);

export default function DeleteMenu({
  currentMenu,
  open,
  onClose,
  handleDeleteClick,
}) {
  return (
    <>
      {currentMenu && (
        <DeleteDialog open={open} onClose={onClose} maxWidth={'xs'}>
          <DeleteDialogTitle>Delete {currentMenu.name}?</DeleteDialogTitle>
          <DialogContent>
            <DialogContentText>
              Residents will no longer be able to see {currentMenu.name} in{' '}
              {currentMenu.restaurant.name}. This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button id="MD-Delete-Cencel-menu-Btn" onClick={onClose}>
              CANCEL
            </Button>
            <Button
              id="MD_confrim-Delete-menu-Btn"
              onClick={handleDeleteClick}
              color="secondary"
            >
              DELETE
            </Button>
          </DialogActions>
        </DeleteDialog>
      )}
    </>
  );
}
