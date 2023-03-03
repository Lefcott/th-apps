/** @format */

import React from 'react';
import { FormSelect } from '../../utils/formComponents';
import { Typography, Box } from '@material-ui/core';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { AccessTime } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  inputAdornedEnd: {
    paddingRight: 0,
  },
});

export default function MealSelector({
  name,
  meal,
  mealOptions,
  setFieldValue,
  error,
  helperText,
  onBlur,
  index,
  disabled,
}) {
  const classes = useStyles();
  function handleMealChange(value) {
    setFieldValue('name', value);
  }

  function handleStartTimeChange(value) {
    setFieldValue('availability.start', value);
  }

  function handleEndTimeChange(value) {
    setFieldValue('availability.end', value);
  }

  const valueRenderer = (value) => {
    return (
      <Typography
        key={value}
        display="block"
        variant="body1"
        style={{ marginRight: '0.25rem', display: 'inline-block' }}
      >
        {value}
      </Typography>
    );
  };

  function getMealNameLabel() {
    switch (index) {
      case 0:
        return 'First Meal';
      case 1:
        return 'Second Meal';
      case 2:
        return 'Third Meal';
    }
  }

  return (
    <Box mt={2}>
      <Box mt={index ? 5 : 0}>
        <FormSelect
          required
          name={name}
          label={getMealNameLabel()}
          variant="outlined"
          value={meal.name}
          id={`DN_meal-${index}-selector`}
          options={mealOptions}
          valueRenderer={valueRenderer}
          onChange={handleMealChange}
          onBlur={onBlur}
          error={error}
          helperText={helperText}
          placeholder="Meal"
          disabled={disabled}
        />
      </Box>
      {meal.availability && (
        <Box mt={2} display="flex">
          <Box mr={0.5}>
            <KeyboardTimePicker
              label="From"
              inputVariant="outlined"
              mask="__:__ _M"
              value={meal.availability.start}
              onChange={handleStartTimeChange}
              keyboardIcon={<AccessTime />}
              disabled={disabled}
            />
          </Box>
          <Box ml={0.5}>
            <KeyboardTimePicker
              label="To"
              inputProps={{ classes }}
              inputVariant="outlined"
              mask="__:__ _M"
              value={meal.availability.end}
              onChange={handleEndTimeChange}
              keyboardIcon={<AccessTime />}
              disabled={disabled}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
