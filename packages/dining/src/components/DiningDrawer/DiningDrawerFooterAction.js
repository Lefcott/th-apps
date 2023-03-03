/** @format */

import React from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const PaddedButton = withStyles(() => ({
  root: {
    marginLeft: '1rem',
    fontSize: '10px',
  },
}))(Button);

export default function DiningDrawerFooterAction({ children, ...props }) {
  return <PaddedButton {...props}>{children}</PaddedButton>;
}
