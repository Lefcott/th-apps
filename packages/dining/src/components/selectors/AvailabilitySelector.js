/** @format */

import React from 'react';
import { isUndefined } from 'lodash';
import { FormSelect } from '../../utils/formComponents';
import { Typography, Box } from '@material-ui/core';
import RRule from 'rrule';

export function createMenuRRule(interval, startDate, endDate) {
  if (!interval) return null;
  return new RRule({
    interval,
    freq: RRule.WEEKLY,
    dtstart: startDate.toJSDate(),
    until: endDate.toJSDate(),
  });
}

export default function AvailabilitySelector({
  name,
  value,
  startDate,
  endDate,
  onChange,
  variant,
  error,
  helperText,
  onBlur,
  disabled,
}) {
  const handleAvailabilityChange = (item) => {
    onChange(createMenuRRule(item.value, startDate, endDate));
  };

  React.useEffect(() => {
    const nextValue = value?.options.interval;
    if (!isUndefined(nextValue)) {
      handleAvailabilityChange({ value: nextValue });
    }
  }, []);

  const options = [
    {
      id: 'DN_recurrence-option-1',
      name: '1 Week',
      value: 1,
    },
    {
      id: 'DN_recurrence-option-4',
      name: '4 Weeks',
      value: 4,
    },
    {
      id: 'DN_recurrence-option-5',
      name: '5 Weeks',
      value: 5,
    },
    {
      id: 'DN_recurrence-option-6',
      name: '6 Weeks',
      value: 6,
    },
  ];

  const availabilityOptions = options.map((item) => ({
    id: item.name,
    displayText: item.name,
    value: item,
    getChecked(value, option) {
      return value === option.value;
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
        {value.name}
      </Typography>
    );
  };

  const val =
    options.find((opt) => opt.value === value?.options?.interval) || options[0];

  return (
    <Box mt={2}>
      <FormSelect
        required
        disabled={disabled}
        name={name}
        variant={variant}
        value={val}
        label="Menu Cycle"
        id="DN_availability-selector"
        options={availabilityOptions}
        valueRenderer={valueRenderer}
        onChange={handleAvailabilityChange}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        placeholder="Schedule"
      />
    </Box>
  );
}
