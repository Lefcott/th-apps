/** @format */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DropzoneArea } from 'material-ui-dropzone';

const useDropzoneAreaStyles = makeStyles({
  root: {
    position: 'absolute',
    left: 0,
    top: 0,
    outline: 'none',
    border: 'dashed 1px rgba(0, 0, 0, 0.3)',
    borderRadius: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    minHeight: '0',
    width: '100%',
    height: '100%',
  },
  icon: {
    display: 'none',
  },
});

export default function PostDropzoneArea({ thumbnail, ...props }) {
  const dropzoneAreaClasses = useDropzoneAreaStyles({ thumbnail });

  const inputProps = {
    'data-testid': 'AP_postmodal-dropzonearea',
  };

  return (
    <DropzoneArea
      data-testid="AP_postmodal-dropzone"
      classes={dropzoneAreaClasses}
      inputProps={inputProps}
      {...props}
    />
  );
}
