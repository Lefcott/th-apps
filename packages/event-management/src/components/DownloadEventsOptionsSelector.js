/** @format */

import { Checkbox, FormControl, FormControlLabel } from '@material-ui/core';
import React from 'react';
import strings from '../constants/strings';

export default function OptionsSelector(props) {
  const { fieldOptions, setFieldOptions } = props;

  const handleChange = (event) => {
    setFieldOptions({
      ...fieldOptions,
      [event.target.name]: event.target.checked,
    });
  };

  const getIds = (name) => {
    const baseId = 'EM_fieldOptions';
    const componentId = `${baseId}-${name}`;

    return {
      id: componentId,
      'data-testid': componentId,
    };
  };

  return (
    <FormControl data-testid="EM_fieldOptions-control" variant="outlined">
      <FormControlLabel
        control={
          <Checkbox
            checked={fieldOptions.description}
            onChange={handleChange}
            name="description"
            color="primary"
            data-testid="EM_fieldOptions-description-checkbox"
            {...getIds('description-checkbox')}
          />
        }
        label={strings.Event.inputs.eventDescriptions}
        {...getIds('description-controlLabel')}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={fieldOptions.period}
            onChange={handleChange}
            name="period"
            color="primary"
            {...getIds('period-checkbox')}
          />
        }
        label={strings.Event.inputs.amAndPm}
        {...getIds('period-controlLabel')}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={fieldOptions.endTime}
            onChange={handleChange}
            name="endTime"
            color="primary"
            {...getIds('endTime-checkbox')}
          />
        }
        label={strings.Event.inputs.eventEndTime}
        {...getIds('endTime-controlLabel')}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={fieldOptions.location}
            onChange={handleChange}
            name="location"
            color="primary"
            {...getIds('location-checkbox')}
          />
        }
        label={strings.Event.inputs.locationNames}
        {...getIds('location-controlLabel')}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={fieldOptions.dayOfWeek}
            onChange={handleChange}
            name="dayOfWeek"
            color="primary"
            {...getIds('dayOfWeek-checkbox')}
          />
        }
        label={strings.Event.inputs.dayOfWeek}
        {...getIds('dayOfWeek-controlLabel')}
      />
    </FormControl>
  );
}
