/** @format */

import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useInputStyles = makeStyles(() => ({
  disabled: {
    color: 'inherit !important',
  },
}));

const useSelectStyles = makeStyles(() => ({
  root: {
    color: 'inherit !important',
    padding: 0,
  },
  outlined: {
    color: 'inherit !important',
    paddingRight: '0 !important',
  },
  icon: {
    display: 'none !important',
  },
}));

const useFormControlStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      marginTop: '1rem',
    },
  },
}));

export default function FormGroup({
  id = `group-form-${uuid()}`,
  label,
  children,
}) {
  const inputClasses = useInputStyles();
  const selectClasses = useSelectStyles();
  const formControlClasses = useFormControlStyles();
  const renderValue = () => children;

  var input = (
    <OutlinedInput label={label} variant="outlined" classes={inputClasses} />
  );

  return (
    <FormControl fullWidth variant="outlined" classes={formControlClasses}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        disabled
        fullWidth
        displayEmpty
        id={id}
        value={true}
        label={label}
        input={input}
        variant="outlined"
        classes={selectClasses}
        renderValue={renderValue}
      >
        <option value={true} />
      </Select>
    </FormControl>
  );
}
