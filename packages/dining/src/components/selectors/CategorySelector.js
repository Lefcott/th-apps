/** @format */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  FormHelperText,
} from '@material-ui/core';

export default function CategorySelector({
  name,
  value,
  options = [],
  onChange,
  variant,
  error,
  helperText,
  onBlur,
  required,
  label,
}) {
  const classes = useStyles();

  return (
    <FormControl
      variant={variant}
      className={classes.formControl}
      error={error}
    >
      <InputLabel
        id="DN_category-selecor-label"
        style={{ backgroundColor: 'white' }}
      >
        {label}
      </InputLabel>
      <Select
        required={required}
        labelId="DN_category-selecor-label"
        id="DN_category-selecor"
        value={value?._id || ''}
        onChange={(evt) => {
          onChange(options.find((x) => x._id === evt.target.value));
        }}
        onBlur={onBlur}
        label={name}
        classes={{}}
      >
        {options.map((option) => (
          <MenuItem
            value={option._id}
            key={option._id}
            style={{ textTransform: 'capitalize' }}
          >
            {option.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText> {helperText} </FormHelperText>
    </FormControl>
  );
}

const useStyles = makeStyles(() => ({
  formControl: {
    width: '100%',
  },
}));
