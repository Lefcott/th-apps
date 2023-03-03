/** @format */

import React from 'react';
import { Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  customChip: {
    color: 'rgb(0,0,0,0.6)',
    backgroundColor: '#F6F6FA',
    fontWeight: 'bold',
    lineHeight: '12px',
    fontSize: '10px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },
}));
export default function ChipHeader(props) {
  const classes = useStyles();
  return <Chip {...props} className={classes.customChip} />;
}
