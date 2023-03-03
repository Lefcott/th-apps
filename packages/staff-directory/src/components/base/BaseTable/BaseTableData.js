/** @format */

import React from 'react';
import { TableRow, TableCell, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import BaseTableLoader from './BaseTableLoader';
import { FixedSizeList as List, areEqual } from 'react-window';
import Autosizer from 'react-virtualized-auto-sizer';
import { camelCase, isEmpty, isFunction, isNil } from 'lodash';
import { useMeasure } from 'react-use';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    minHeight: '100%',
    [theme.breakpoints.up('xs')]: {
      height: 'fill-available',
    },
  },
  list: {
    [theme.breakpoints.up('md')]: {
      minHeight: '70vh',
      maxHeight: '72vh',
    },

    '& > div': {
      [theme.breakpoints.down('sm')]: {
        paddingBottom: '60px',
      },
    },
  },
}));

const useCellStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    paddingLeft: theme.spacing(2),
    paddingTop: ({ slim }) => (slim ? 0 : theme.spacing(2)),
    paddingBottom: ({ slim }) => (slim ? 0 : theme.spacing(2)),
    borderBottom: '0px solid transparent !important',
  },
}));

const useRowStyles = makeStyles((theme) => ({
  root: {
    // '&:first-child': {
    //   marginTop: theme.spacing(2),
    // },
    '&:last-child:not(:only-child)': {
      marginBottom: theme.spacing(1),
    },
  },
}));

const useEmptySearchResultStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.grey[700],
    fontSize: theme.spacing(1.75),
  },
}));

function EmptyResultRow({ message }) {
  const rowClasses = useRowStyles();
  const cellClasses = useCellStyles();
  const messageClasses = useEmptySearchResultStyles();

  return (
    <TableRow classes={rowClasses}>
      <TableCell classes={cellClasses}>
        <Typography classes={messageClasses}>{message}</Typography>
      </TableCell>
    </TableRow>
  );
}

function EmptySearchResultRow({ globalFilterValue, message }) {
  function getMessage() {
    if (isFunction(message)) {
      return message(globalFilterValue);
    } else if (!isNil(message)) {
      return message;
    } else {
      return `No matches for "${globalFilterValue}"`;
    }
  }

  return <EmptyResultRow message={getMessage()} />;
}

export default function BaseTableData({
  rows,
  prepareRow,
  rowOptions = {},
  globalFilterValue,
  emptySearchResultMessage,
  loading,
  ...props
}) {
  const [ref, { width, height }] = useMeasure();
  const { slim } = rowOptions;
  const classes = useStyles();
  const rowClasses = useRowStyles();
  const cellClasses = useCellStyles({ slim });

  const RenderRow = React.memo(({ index, style }) => {
    const row = rows[index];
    prepareRow(row);
    return (
      <TableRow
        className={'SD_staffMember-row'}
        {...row.getRowProps({
          style,
        })}
        classes={rowClasses}
      >
        {row.cells.map((cell) => {
          return (
            <TableCell
              className={`SD_staffMember-row_${camelCase(
                cell.column.Header,
              )}-${++index}`}
              {...cell.getCellProps()}
              classes={cellClasses}
            >
              {cell.render('Cell')}
            </TableCell>
          );
        })}
      </TableRow>
    );
  }, areEqual);

  if (loading) {
    return Array.from({ length: 3 }).map((_, index) => (
      <TableRow className="SD_table-item" key={index}>
        <BaseTableLoader />
      </TableRow>
    ));
  }

  if (!isEmpty(globalFilterValue) && !rows.length) {
    return (
      <EmptySearchResultRow
        message={emptySearchResultMessage}
        globalFilterValue={globalFilterValue}
      />
    );
  }

  if (!isEmpty(rowOptions.emptyResultMessage) && !rows.length) {
    return <EmptyResultRow message={rowOptions.emptyResultMessage} />;
  }

  return (
    <div ref={ref} className={classes.root}>
      <Autosizer defaultHeight={height} defaultWidth={width}>
        {({ height, width }) => (
          <List
            id="SD_StaffMemberVirtualContainer"
            data-testid="SD_StaffMemberVirtualContainer"
            height={height}
            width={width}
            itemCount={rows.length}
            itemSize={60}
            overscanCount={20}
            className={classes.list}
          >
            {RenderRow}
          </List>
        )}
      </Autosizer>
    </div>
  );
}
