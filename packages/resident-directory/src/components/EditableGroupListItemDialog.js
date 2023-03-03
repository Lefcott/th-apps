/** @format */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  Typography,
} from '@material-ui/core';
import strings from '../constants/strings';

function EditableGroupListItemDialog({ handleClose, handleSubmit, isOpen }) {
  const isMobile = useMediaQuery('(max-width:960px)');

  return (
    <Dialog
      id="RD_removeResidentGroupDialog"
      open={isOpen}
      onClose={handleClose}
      fullScreen={isMobile}
    >
      <DialogTitle>{strings.Form.dialog.deleteResidentGroupTitle}</DialogTitle>

      <DialogContent dividers style={{ minWidth: 400 }}>
        <Typography>
          {strings.Form.dialog.deleteResidentGroupWarning}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          id="RD_removeResidentGroup-cancel"
          onClick={handleClose}
          style={{ textTransform: 'uppercase' }}
        >
          {strings.Card.button.cancel}
        </Button>
        <Button
          id="RD_removeResidentGroup-confirm"
          color="primary"
          variant="contained"
          onClick={handleSubmit}
          style={{
            padding: '5px 25px',
            marginLeft: 15,
            textTransform: 'uppercase',
          }}
        >
          {strings.Card.button.confirmDelete}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditableGroupListItemDialog;
