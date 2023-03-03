/** @format */

import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { ArrowBackRounded } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

export default function FormHeader({ onClick, title }) {
  const classes = useStyles();

  const handleClick = React.useCallback(() => {
    onClick();
  }, []);

  return (
    <Box display="flex" alignItems="center">
      <ArrowBackRounded className={classes.icon} onClick={handleClick} />
      <Typography className={classes.label}> {title} </Typography>
    </Box>
  );
}

const useStyles = makeStyles(() => ({
  icon: {
    marginRight: '16px',
    color: 'rgba(0, 0, 0, 0.54)',
    cursor: 'pointer',
  },
  label: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight: 500,
  },
}));
