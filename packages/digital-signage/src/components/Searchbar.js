/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import { TextField, InputAdornment } from '@material-ui/core';
import { Search, Clear } from '@material-ui/icons';

export default function Searchbar(props) {
  return (
    <TextField
      {...props}
      onChange={(e) => props.onChange(e.target.value)}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <InputAdornment position="end">
            {!props.value || props.value.length === 0 ? (
              <Search />
            ) : (
              <Clear
                style={{ cursor: 'pointer' }}
                onClick={() => props.onChange('')}
              />
            )}
          </InputAdornment>
        ),
      }}
    />
  );
}

Searchbar.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

Searchbar.defaultProps = {
  value: '',
};
