/** @format */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useFlexLayout, useTable, useGlobalFilter } from "react-table";
import { Box } from "@material-ui/core";

import BaseTableContainer from "./BaseTableContainer";
import BaseTableToolbar from "./BaseTableToolbar";
import BaseTableHeader from "./BaseTableHeader";
import BaseTableBody from "./BaseTableBody";
import BaseTableData from "./BaseTableData";
import { createIdGenerator } from "./utils";
import { ActionCell } from "./cell-types";
import { isEqual, isObject, isNil, isString, escapeRegExp } from "lodash";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "fill-available",
  },

  container: {
    boxShadow: "0 0 0 1px #C4C4C4",
    borderRadius: theme.spacing(0.5),
  },
}));

function BaseTable({
  id,
  data = [],
  columns,
  rowOptions = {},
  toolbarOptions,
  searchable,
  searchOptions,
  alertsConfigured,
  ...props
}) {
  const classes = useStyles();
  const idGenerator = createIdGenerator(id);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumn = useMemo(
    () => [
      ...columns,
      // {
      //   Header: "",
      //   disableGlobalFilter: true,
      //   id: "actions",
      //   width: 30,
      //   minWidth: 45,
      //   Cell: ActionCell,
      //   accessor() {
      //     return rowOptions.actions;
      //   },
      // },
    ],
    [columns] //, rowOptions.actions
  );
  const memoizedGlobalFilterFn = useCallback(searchOptions.onGlobalFilter, [
    searchOptions,
  ]);

  const memoizedDefaultFilterFn = useCallback(
    (rows, filterableColumns, filterValue) => {
      if (!filterValue) return rows;
      const search = new RegExp(escapeRegExp(filterValue), "gi");

      return rows.filter((row) => {
        return filterableColumns.find((col) => {
          let val = row.values[col];

          if (isNil(val)) {
            return false;
          }

          if (isObject(val)) {
            const { filterable, data } = val;
            const filterCols = filterable || Object.keys(data);
            return filterCols.find(
              (key) => data[key] && data[key].toString().match(search)
            );
          }

          if (!isString(val)) {
            val = val.toString();
          }

          return val.match(search);
        });
      });
    },
    []
  );

  const initialState = {
    globalFilter: globalFilterValue,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable(
    {
      initialState,
      idGenerator,
      globalFilterValue,
      globalFilter: memoizedDefaultFilterFn,
      data: memoizedData,
      columns: memoizedColumn,
      autoResetFilters: false,
      manualGlobalFilter: !!memoizedGlobalFilterFn,
    },
    useFlexLayout,
    useGlobalFilter
  );
  useEffect(() => {
    if (memoizedGlobalFilterFn) {
      memoizedGlobalFilterFn({ globalFilterValue });
    } else if (setGlobalFilter) {
      setGlobalFilter(globalFilterValue);
      searchOptions.onSearch(globalFilterValue);
    }
  }, [globalFilterValue, memoizedGlobalFilterFn, setGlobalFilter]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100%"
      className={classes.root}
    >
      <BaseTableToolbar
        searchable={searchable}
        idGenerator={idGenerator.createWithAppendedPrefix("toolbar")}
        searchOptions={searchOptions}
        toolbarOptions={toolbarOptions}
        setGlobalFilterValue={setGlobalFilterValue}
      />
      <Box
        className={classes.container}
        overflow="hidden"
        display="flex"
        flexDirection="column"
        flexGrow={1}
      >
        <BaseTableContainer
          tableProps={getTableProps()}
          toolbarOptions={toolbarOptions}
        >
          <BaseTableHeader headerGroups={headerGroups} />
          <BaseTableBody tableBodyProps={getTableBodyProps()}>
            <BaseTableData
              error={props.error}
              loading={props.loading}
              rows={rows}
              rowOptions={rowOptions}
              prepareRow={prepareRow}
              alertsConfigured={alertsConfigured}
              globalFilterValue={globalFilterValue}
              emptySearchResultMessage={searchOptions.emptyResultMessage}
            />
          </BaseTableBody>
        </BaseTableContainer>
      </Box>
    </Box>
  );
}

function compareFn(prevProps, nextProps) {
  const prev = {
    data: prevProps.data,
    rowOptions: prevProps.rowOptions,
    error: prevProps.error,
    loading: prevProps.loading,
    toolbarOptions: prevProps.toolbarOptions,
  };
  const next = {
    data: nextProps.data,
    rowOptions: nextProps.rowOptions,
    error: nextProps.error,
    loading: nextProps.loading,
    toolbarOptions: nextProps.toolbarOptions,
  };
  return isEqual(prev, next);
}

export default React.memo(BaseTable, compareFn);
