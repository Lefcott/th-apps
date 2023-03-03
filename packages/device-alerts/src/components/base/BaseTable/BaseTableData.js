/** @format */

import React from "react";
import { TableRow, TableCell, Typography, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import BaseTableLoader from "./BaseTableLoader";
import { FixedSizeList as List, areEqual } from "react-window";
import Autosizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { isEmpty, isFunction, isNil } from "lodash";
import { useMeasure } from "react-use";
import { navigateToSettings } from "../../../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    [theme.breakpoints.up("xs")]: {
      height: "fill-available",
    },
  },
  list: {
    "& > div": {
      [theme.breakpoints.down("sm")]: {
        paddingBottom: "60px",
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
    borderBottom: ({ noDivider }) =>
      noDivider && "0px solid transparent !important",
  },
}));

const useRowStyles = makeStyles((theme) => ({
  root: {
    "&:last-child:not(:only-child)": {
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

function NoResultRow({ globalFilterValue, emptySearchResultMessage }) {
  const rowClasses = useRowStyles();
  const cellClasses = useCellStyles({ noDivider: true });
  const messageClasses = useEmptySearchResultStyles();

  function getMessage() {
    if (isFunction(emptySearchResultMessage)) {
      return emptySearchResultMessage(globalFilterValue);
    } else if (!isNil(emptySearchResultMessage)) {
      return emptySearchResultMessage;
    } else {
      return `No matches for "${globalFilterValue}"`;
    }
  }

  return (
    <TableRow classes={rowClasses} align="center">
      <TableCell classes={cellClasses}>
        <Typography classes={messageClasses}>{getMessage()}</Typography>
      </TableCell>
    </TableRow>
  );
}

function AlertsNotSetupRow() {
  const rowClasses = useRowStyles();
  const cellClasses = useCellStyles();
  const messageClasses = useEmptySearchResultStyles();

  return (
    <TableRow classes={rowClasses} align="center">
      <TableCell classes={cellClasses} align="center">
        <Typography classes={messageClasses}>Alerts not set up yet.</Typography>
        <Typography classes={messageClasses}>
          Go to{" "}
          <Link href="#" onClick={navigateToSettings} id="SD_table-settingsBtn">
            Settings {">"} Building Alerts
          </Link>{" "}
          to set up alerts.
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export default function BaseTableData({
  rows,
  prepareRow,
  rowOptions = {},
  globalFilterValue,
  emptySearchResultMessage,
  alertsConfigured,
  loading,
  error,
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
        {...row.getRowProps({
          style,
        })}
        classes={rowClasses}
      >
        {row.cells.map((cell) => {
          return (
            <TableCell {...cell.getCellProps()} classes={cellClasses}>
              {cell.render("Cell")}
            </TableCell>
          );
        })}
      </TableRow>
    );
  }, areEqual);

  if (loading) {
    return Array.from({ length: 3 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <BaseTableLoader />
        </TableCell>
        <TableCell>
          <BaseTableLoader />
        </TableCell>
        <TableCell>
          <BaseTableLoader />
        </TableCell>
        <TableCell>
          <BaseTableLoader />
        </TableCell>
      </TableRow>
    ));
  }

  if (isEmpty(alertsConfigured)) {
    return <AlertsNotSetupRow />;
  }

  if (error) {
    return (
      <NoResultRow
        emptySearchResultMessage={
          "There is an error retrieving  your alerts now, try again later"
        }
        globalFilterValue={globalFilterValue}
      />
    );
  }

  if (isEmpty(globalFilterValue) && !rows.length) {
    return (
      <NoResultRow
        emptySearchResultMessage={"No Alerts have been triggered."}
        globalFilterValue={globalFilterValue}
      />
    );
  }

  if (!isEmpty(globalFilterValue) && !rows.length) {
    return (
      <NoResultRow
        emptySearchResultMessage={emptySearchResultMessage}
        globalFilterValue={globalFilterValue}
      />
    );
  }

  return (
    <div ref={ref} className={classes.root}>
      <InfiniteLoader
        isItemLoaded={(index) => index < rows.length - 1}
        itemCount={rows.length}
        loadMoreItems={
          !loading && rowOptions.hasNextPage ? rowOptions.fetchMore : () => {}
        }
      >
        {({ onItemsRendered, ref }) => (
          <List
            id="SD_StaffMemberVirtualContainer"
            data-testid="SD_StaffMemberVirtualContainer"
            height={height}
            style={{
              minHeight: "100%",
            }}
            width={width}
            itemCount={rows.length}
            ref={ref}
            itemSize={60}
            onItemsRendered={onItemsRendered}
            className={classes.list}
          >
            {RenderRow}
          </List>
        )}
      </InfiniteLoader>
    </div>
  );
}
