/** @format */

import React from 'react';
import { Box, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const PaddedButton = withStyles(() => ({
  root: {
    marginLeft: '1rem',
    fontSize: '10px',
    backgroundColor: (props) =>
      props.color === 'secondary' ? '#C62828' : null,
  },
}))(Button);

const Message = withStyles(() => ({
  root: {
    fontSize: '16px',
  },
}))(Typography);

export default function DiningDrawerCloseConfirmation({
  onConfirm,
  onCancel,
  message,
  confirmColor = 'primary',
  confirmText = 'Close',
}) {
  return (
    <Box m={2} mt={0}>
      <Box mt={2} mb={3}>
        <Message>{message}</Message>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <PaddedButton id="DD_go-Back-Btn" variant="text" onClick={onCancel}>
          Go Back
        </PaddedButton>
        <PaddedButton
          id="DD_confirm-cancel-Btn"
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
        >
          {confirmText}
        </PaddedButton>
      </Box>
    </Box>
  );
}
