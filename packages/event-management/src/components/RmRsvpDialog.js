/** @format */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
} from '@material-ui/core';
import { useMutation } from '@teamhub/apollo-config';
import { UPDATE_EVENT } from '../graphql/events';
import strings from '../constants/strings';

function RemoveRsvpDialog(props) {
  const isMobile = useMediaQuery('(max-width:960px)');
  const { isOpen, onClose, variables, onSuccess } = props;

  const [updateEvent] = useMutation(UPDATE_EVENT);
  const editEvent = () => {
    updateEvent({ variables })
      .then(() => {
        onSuccess(variables?.updates?.name);
        onClose();
      })
      .catch((err) => errorOnSave(err));
  };

  const errorOnSave = (err) => {
    console.warn(err);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullScreen={isMobile}>
      <DialogTitle>{strings.Buttons.confirm}</DialogTitle>
      <DialogContent dividers>
        <div>{strings.Event.changeDateOrTime}</div>
        <div>{strings.Event.cannotUndo}</div>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          {strings.Buttons.cancel}
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={editEvent}
          style={{ padding: '5px 25px', marginLeft: 15 }}
        >
          {strings.Buttons.save}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RemoveRsvpDialog;
