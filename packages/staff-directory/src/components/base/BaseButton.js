/** @format */

import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(1)}px ${theme.spacing(3.5)}px`,
  },
}));

export default function BaseButton({ children, ...props }) {
  const classes = useStyles();
  return (
    <Button classes={classes} variant="contained" color="primary" {...props}>
      {children}
    </Button>
  );
}
