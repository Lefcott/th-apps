/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  InputLabel,
  Select,
  Input,
  Chip,
  FormHelperText,
} from '@material-ui/core';

const ChipsDropdown = (props) => (
  <FormControl {...props.controlprops}>
    <InputLabel shrink>{props.label}</InputLabel>
    <Select
      {...props}
      multiple
      input={<Input />}
      renderValue={(options) => (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {options.map((option) => (
            <Chip
              onMouseDown={(event) => event.stopPropagation()}
              key={option.guid}
              label={option.name}
              variant="outlined"
              onDelete={() => props.chipdelete(option)}
              style={{ margin: 2 }}
            />
          ))}
        </div>
      )}
      MenuProps={{
        getContentAnchorEl: null,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      }}
    >
      {props.children}
    </Select>
    {props.helpertext ? (
      <FormHelperText>{props.helpertext}</FormHelperText>
    ) : null}
  </FormControl>
);

ChipsDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  chipdelete: PropTypes.func.isRequired,
};

export default ChipsDropdown;
