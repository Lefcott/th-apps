/** @format */

import React from 'react';
import { FormSelect } from '../../utils/formComponents';
import { Typography, Box } from '@material-ui/core';

export default function RestaurantSelector({
  name,
  value,
  options = [],
  onChange,
  variant,
  error,
  helperText,
  onBlur,
  disabled,
}) {
  const restaurantOptions = options.map((item) => ({
    id: item._id,
    displayText: item.name,
    value: item._id,
    getChecked(value, option) {
      return value === option.id;
    },
  }));
  const valueRenderer = (value) => {
    return (
      <Typography
        key={value._id}
        display="block"
        variant="body1"
        style={{ marginRight: '0.25rem', display: 'inline-block' }}
      >
        {options.find((res) => res._id === value)?.name}
      </Typography>
    );
  };

  return (
    <Box mt={2}>
      <FormSelect
        required
        name={name}
        variant={variant}
        value={value}
        label="Restaurant"
        id="DN_restaurant-selector"
        options={restaurantOptions}
        valueRenderer={valueRenderer}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        placeholder="Restaurant"
        disabled={disabled}
      />
    </Box>
  );
}
