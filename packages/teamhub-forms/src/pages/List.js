/* eslint-disable no-undef */
import React, { Suspense, useMemo } from "react";
import _ from "lodash";
import { useRecoilValue, useRecoilState } from "recoil";

import { makeStyles } from "@material-ui/core/styles";

import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";

import NewFormButton from "../components/NewFormButton";
import FormRow from "../components/FormRow";

import { formsList } from "../recoil/selectors";

const List = (props) => {
  const { classes } = props;
  const forms = useRecoilValue(formsList);
  const sortedForms = useMemo(() => {
    return [...forms].sort((a, b) =>
      a?.modifiedTimestamp < b?.modifiedTimestamp ? 1 : -1
    );
  }, [forms]);

  return (
    <>
      <NewFormButton classes={classes} />
      <Suspense fallback={<h3>Loading...</h3>}>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="left">Date Edited</TableCell>
                <TableCell align="left">Destination</TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.map(sortedForms, (row) => {
                return <FormRow key={row.id} row={row} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Suspense>
    </>
  );
};

export default List;
