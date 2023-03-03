import React from 'react';

import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@material-ui/core';

import strings from '../constants/strings';

import {
  useDialogActionsStyles,
  useDialogContentStyles,
  useDialogStyles,
  useDownloadButtonStyles,
  useCircularProgressStyles,
} from './useStyles';

export default function ExportDialog(props) {
  const {
    title,
    content,
    handleClose,
    isDialogOpen,
    action,
    isLoading,
    fullWidth = true,
  } = props;

  const dialogActionsStyles = useDialogActionsStyles();
  const dialogContentStyles = useDialogContentStyles();
  const dialogStyles = useDialogStyles();
  const downloadButtonClasses = useDownloadButtonStyles();
  const circularProgressClasses = useCircularProgressStyles();

  return (
    <>
      <Dialog
        classes={dialogStyles}
        open={isDialogOpen}
        onClose={handleClose}
        fullWidth={fullWidth}
        maxWidth="md"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent classes={dialogContentStyles}>{content}</DialogContent>
        <DialogActions classes={dialogActionsStyles}>
          <Button onClick={handleClose}>{strings.export.close}</Button>
          <Button
            disabled={isLoading}
            variant="contained"
            color="primary"
            classes={downloadButtonClasses}
            onClick={action}
          >
            {isLoading ? (
              <>
                <CircularProgress
                  size={20}
                  thickness={4}
                  color="primary"
                  classes={circularProgressClasses}
                />
                <Typography classes={{ root: downloadButtonClasses.text }}>
                  {strings.export.downloading}
                </Typography>
              </>
            ) : (
              strings.export.download
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
