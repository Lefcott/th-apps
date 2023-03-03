/** @format */

import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { VisibilityOffOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    color: 'rgba(0, 0, 0, 0.6)',
  },
}));

export default function FeatureNotAvailable() {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flex={1}
      flexDirection="column"
    >
      <Box>
        <VisibilityOffOutlined classes={classes} />
      </Box>
      <Box mt={2}>
        <Typography classes={classes}>
          This feature is not available on mobile.
        </Typography>
      </Box>
    </Box>
  );
}
