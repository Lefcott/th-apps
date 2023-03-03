/** @format */

import React, { useState, useEffect } from 'react';
import {
  DragStatus,
  getStatusColor,
  getFilesFromEvent,
  getStatusFromFiles,
} from './utils';
import { DropzoneArea } from 'material-ui-dropzone';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const usePostFullscreenDropzoneStyles = makeStyles({
  root: {
    opacity: 0,
    height: '100%',
    width: '100%',
  },
});

const usePostDropzoneFullscreenIndicatorStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    top: 0,
    left: 0,
    zIndex: 11,
    boxShadow: ({ status }) =>
      `inset 0 0 0 10px ${getStatusColor(status, theme)}`,
  },
}));

export default function PostDropzoneFullscreen({
  onDrop,
  acceptedFiles,
  filesLimits,
  ...props
}) {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState(DragStatus.DEFAULT);

  useEffect(() => {
    window.addEventListener('dragenter', handleDragEnter);
    return () => window.removeEventListener('dragenter', handleDragEnter);
  });

  async function handleDragEnter(event) {
    setIsActive(true);
    const files = await getFilesFromEvent(event);
    const status = getStatusFromFiles(files, acceptedFiles, filesLimits);
    setStatus(status);
  }

  function handleDragLeave() {
    setIsActive(false);
    setStatus(DragStatus.DEFAULT);
  }

  function handleDrop(files) {
    setIsActive(false);
    return onDrop(files);
  }

  const dropzoneIndicatorClasses = usePostDropzoneFullscreenIndicatorStyles({
    status,
  });
  const dropzoneClasses = usePostFullscreenDropzoneStyles();
  const dropzoneProps = {
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  };

  return isActive ? (
    <Box
      role="dropzone-indicator"
      data-status={status}
      className={dropzoneIndicatorClasses.root}
    >
      <DropzoneArea
        {...props}
        acceptedFiles={acceptedFiles}
        classes={dropzoneClasses}
        dropzoneProps={dropzoneProps}
      />
    </Box>
  ) : null;
}
