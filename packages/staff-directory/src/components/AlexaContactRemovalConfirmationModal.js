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
import { REMOVE_COMMUNITY_ALEXA_CONTACT } from '../graphql/address-book';
import { sendPendoEvent, getCommunityId } from '@teamhub/api';
import { useTheme } from '@material-ui/styles';
import { useMutation } from '@teamhub/apollo-config';
import { showToast } from '@teamhub/toast';
import BaseLoader from './base/BaseLoader';

function generateId(component) {
  return `SD_ContactRemovalConfirmationModal-${component}`;
}

export default function AlexaContactRemovalConfirmationModal({
  open,
  onCancel,
  onConfirm,
  contact,
}) {
  const communityId = getCommunityId();
  const theme = useTheme();

  const [removeContact, { loading }] = useMutation(
    REMOVE_COMMUNITY_ALEXA_CONTACT,
    {
      onCompleted() {
        sendPendoEvent('alexa_contact_deleted', null);
      },
    },
  );
  async function handleConfirm() {
    await removeContact({
      variables: {
        communityId,
        input: {
          contactName: contact.name,
        },
      },
    });

    onConfirm();
    showToast(`${contact.name} removed from directory.`);
  }

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          maxWidth: '350px',
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">{`Remove ${contact?.name}?`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`This will permanently remove the ability of residents to call ${contact?.name} using their Alexa device.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          id={generateId('action-cancel')}
          onClick={onCancel}
          disabled={loading}
          style={{
            color: theme.palette.text.disabled,
          }}
        >
          Cancel
        </Button>
        <Button
          id={generateId('actionsremove')}
          onClick={handleConfirm}
          color="secondary"
          disabled={loading}
        >
          {loading ? <BaseLoader /> : 'Remove '}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
