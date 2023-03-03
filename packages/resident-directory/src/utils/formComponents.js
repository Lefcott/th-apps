/** @format */

import React from 'react';
import { DropdownSelect } from '../components/reusableComponents';
import { KeyboardDatePicker, DatePicker } from '@material-ui/pickers';
import { InputAdornment, IconButton, TextField } from '@material-ui/core';
import InputMask from 'react-input-mask';

export const FormTextfield = ({ value, ...props }) => (
  <TextField
    {...props}
    value={value || ''}
    fullWidth
    InputLabelProps={{ shrink: true }}
  />
);

export const FormDropdown = ({ value, ...props }) => {
  const defaultInputLabelProps =
    props?.inputlabelprops?.defaultShrink === false ? {} : { shrink: true };
  return (
    <DropdownSelect
      {...props}
      value={value || ''}
      inputlabelprops={{ ...defaultInputLabelProps, ...props.inputlabelprops }}
      controlprops={{ ...props, fullWidth: true }}
      displayEmpty
    />
  );
};

export const FormKeyboardDatePicker = (props) => (
  <KeyboardDatePicker
    {...props}
    fullWidth
    InputLabelProps={{ shrink: true }}
    keyboardIcon={props.iconButton}
    InputProps={{ position: 'end' }}
    KeyboardButtonProps={props.buttonProps}
  />
);
export const FormDatePicker = (props) => (
  <DatePicker
    {...props}
    fullWidth
    InputLabelProps={{ shrink: true }}
    inputadornmentprops={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton disabled={props.disabled}>{props.iconbutton}</IconButton>
        </InputAdornment>
      ),
    }}
  />
);

export const PhoneMask = ({ value, ...props }) => (
  <InputMask {...props} value={value || ''} mask="999-999-9999" maskChar=" ">
    {() => props.children}
  </InputMask>
);
