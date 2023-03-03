/** @format */

import React from 'react';
import { Table } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useIsMobile } from './utils';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0px 1px 0px #E5E5E5',
    marginBottom: ({ hasFab }) => (hasFab ? theme.spacing(10) : 0),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.up('xs')]: {
      height: 'fill-available',
    },
  },
}));

export default function BaseTableContainer({
  children,
  tableProps,
  toolbarOptions,
}) {
  const [isMobile] = useIsMobile();
  const classes = useStyles({ hasFab: isMobile && toolbarOptions.fabOnMobile });
  return (
    <Table {...tableProps} classes={classes}>
      {children}
    </Table>
  );
}
