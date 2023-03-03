import React from 'react';
import { Table, TableRow, TableHead, TableBody, TableCell } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  table: {
    height: '100%',
    width: '100%'
  }
}))

export default function ReportTable(props) {
  const { data, columns } = props;
  const classes = useStyles();
  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {columns.map((column, i) => (
            <TableCell key={`${column.name}-${i}`} style={{ width: column.width || 'inherit' }}>{column.name}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((rowData, i) => {
          return (
            <TableRow key={`${rowData.guid}-${i}`}>{columns.map(column => <TableCell key={`${rowData.guid}-${column.name}-${i}`}>{column.render(rowData, i)}</TableCell>)}</TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
