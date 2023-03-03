/** @format */

import React from 'react';
import { FormTextfield } from '../../utils/formComponents';
import { Typography, Box } from '@material-ui/core';

export default function RepeatMenuCycleSelector({
  name,
  onChange,
  variant,
  error,
  helperText,
  onBlur,
  value,
  disabled,
  type,
}) {
  function getWeekString() {
    return value > 1 ? 'times' : 'time';
  }
  return (
    <Box mt={2} display="flex" alignItems="center">
      <Box flex={3}>
        <FormTextfield
          required
          name={name}
          variant={variant}
          disabled={disabled}
          onBlur={onBlur}
          error={error}
          value={value}
          label="Repeat Menu Cycle"
          helperText={helperText}
          inputProps={{
            style: {
              textAlign: 'center',
            },
          }}
          onChange={onChange}
          type={type}
        />
      </Box>
      <Box p={1} mt={0.5} flex={2} ml={1}>
        <Typography>{getWeekString()}</Typography>
      </Box>
    </Box>
  );
}
