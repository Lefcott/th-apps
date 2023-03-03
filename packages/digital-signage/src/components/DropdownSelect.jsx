import React, { useState, useEffect } from 'react';
import { HelperText } from '../utilities/helper';
import { FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import { identity, pickBy } from 'lodash';

const DropdownSelect = params => {
  //don't allow nulls, instead set defaults
  const {
    data,
    value = '',
    parentHandleChange,
    helperText,
    name,
    native,
    selectorLabel,
    disabled,
    clearItem,
    clearItemText,
    style,
    variant
  } = pickBy(params, identity);
  const [val, setVal] = useState(value);

  useEffect(() => {
    setVal(value);
  });

  return (
    <FormControl variant={variant} style={style}>
      <InputLabel>{selectorLabel}</InputLabel>
      <Select
        native={native}
        value={val}
        disabled={disabled}
        onChange={e => {
          setVal(e.target.value);
          parentHandleChange(e.target.value, name);
        }}
        input={<Input variant={variant || 'standard'} name='value' />}
        variant={variant}
      >
        {clearItem ? <MenuItem value=''>{clearItemText}</MenuItem> : null}
        {data.map((option, i) => {
          if (native) {
            return (
              <option key={i} value={option}>
                {option.name}
              </option>
            );
          } else {
            return (
              <MenuItem key={i} value={option}>
                {option.name}
              </MenuItem>
            );
          }
        })}
      </Select>
      <HelperText helperText={helperText} />
    </FormControl>
  );
};

export default DropdownSelect;
