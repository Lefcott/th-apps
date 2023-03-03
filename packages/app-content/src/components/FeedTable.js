/** @format */

import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
} from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import FeedTableBody from './FeedTableBody';
const headers = [
  { text: 'Title', width: '25%' },
  { text: 'Start Date', width: '16%' },
  { text: 'End Date', width: '16%' },
  { text: 'Audience', width: '17%' },
  { text: 'Category', width: '10%' },
  { text: 'Folders', width: '24%' },
  { text: '', width: '6%' },
];

const ResponsiveTable = withStyles((theme) => ({
  root: {
    tableLayout: 'fixed',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      tableLayout: 'auto',
    },
  },
}))(Table);

const useStyles = makeStyles({
  tooltip: {
    fontSize: '14px',
  },
  cellNoPadding: {
    padding: '10px',
  },
  rowWithLeftPadding: {
    '&:first-child': {
      paddingLeft: '36px',
    },
  },
  redColor: {
    color: 'red',
  },
});

export default function FeedTable(props) {
  const { posts = [], page, total, onChangePage, lastPage } = props;
  const classes = useStyles();
  return (
    <ResponsiveTable size="small" data-testid="AP_feed-table">
      <TableHead style={{ borderTop: '2px solid #E5E5E5' }}>
        <TableRow className={classes.rowWithLeftPadding}>
          {headers.map((header, i) => (
            <TableCell
              id={`AP_tableHeader-${header.text}`}
              style={{
                color: 'rgba(0, 0, 0, 0.6)',
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                padding: '10px',
                paddingLeft: i === 0 ? '36px' : '10px',
                width: header.width,
              }}
              key={header.text}
            >
              {header.text}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody data-testid="AP_feed-table-body">
        <FeedTableBody {...props} classes={classes} />
      </TableBody>
      {posts.length > 0 && (
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10]}
              page={page}
              rowsPerPage={10}
              count={total}
              ActionsComponent={(pagingProps) => (
                <PaginationActions {...pagingProps} lastPage={lastPage} />
              )}
              onPageChange={onChangePage}
            />
          </TableRow>
        </TableFooter>
      )}
    </ResponsiveTable>
  );
}

const usePageActionStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function PaginationActions(props) {
  const { page, lastPage, onPageChange } = props;
  const classes = usePageActionStyles();
  return (
    <div className={classes.root}>
      <IconButton
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        id="AP_PaginationActions-IconButton-PrevPage"
        data-testid="AP_PaginationActions-IconButton-PrevPage"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={() => onPageChange(page + 1)}
        disabled={page === lastPage}
        id="AP_PaginationActions-IconButton-NextPage"
        data-testid="AP_PaginationActions-IconButton-NextPage"
      >
        <KeyboardArrowRight />
      </IconButton>
    </div>
  );
}
