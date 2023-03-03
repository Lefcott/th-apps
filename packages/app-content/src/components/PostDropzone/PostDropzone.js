/** @format */

import React from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PostDropzoneFullScreen from './PostDropzoneFullScreen';
import PostDropzoneArea from './PostDropzoneArea';
import PostDropzoneInfo from './PostDropzoneInfo';

const ACCEPTED_FILE_TYPES = [
  'image/jpg',
  'application/pdf',
  'image/jpeg',
  'image/png',
];

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: ({ thumbnail }) => (thumbnail ? '160px' : '256px'),
    width: ({ thumbnail }) => (thumbnail ? '160px' : '100%'),
    [theme.breakpoints.up('md')]: {
      height: '160px !important',
      width: ({ thumbnail }) => (thumbnail ? '160px' : '100%'),
    },
  },
}));

export default function PostDropzone({
  fullscreen,
  thumbnail,
  error,
  onChooseDesign,
  ...props
}) {
  const classes = useStyles({ thumbnail });
  return (
    <>
      {fullscreen && <PostDropzoneFullScreen {...props} />}
      <Box className={classes.root}>
        <PostDropzoneInfo
          error={error}
          thumbnail={thumbnail}
          onChooseDesign={onChooseDesign}
        />
        <PostDropzoneArea thumbnail={thumbnail} {...props} />
      </Box>
    </>
  );
}

PostDropzone.defaultProps = PostDropzone.defaultProps = {
  fullscreen: false,
  thumbnail: false,
  filesLimit: 50,
  showAlerts: false,
  dropzoneText: '',
  showPreviews: false,
  showPreviewsInDropzone: false,
  maxFileSize: 80000000,
  acceptedFiles: ACCEPTED_FILE_TYPES,
};
