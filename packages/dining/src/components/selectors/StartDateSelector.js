/** @format */

import React from 'react';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { DateTime } from 'luxon';
import DateFnsUtils from '@date-io/date-fns';
import locale from 'date-fns/locale/en-US';

if (locale && locale.options) {
  locale.options.weekStartsOn = 0;
}

export default function StartDateSelector({
  error,
  value,
  onChange,
  name,
  disabled,
  disabledDays = [],
  minDate,
}) {
  const displayValue = (value) =>
    value >= DateTime.local().startOf('day') &&
    value <= DateTime.local().endOf('day')
      ? 'Immediately'
      : `Week of ${value.toFormat('LLLL dd')}`;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
      <KeyboardDatePicker
        required
        inputVariant="outlined"
        name={name}
        disabled={disabled}
        value={value}
        id="MD-Calander-startdate"
        onChange={onChange}
        format="MM dd, yyyy"
        error={error}
        minDate={minDate}
        label="Start Date"
        helperText=""
        InputAdornmentProps={{
          id: 'MD_Calandar-Icon',
        }}
        shouldDisableDate={(day) =>
          disabledDays.includes(DateTime.fromJSDate(day).weekday % 7)
        }
        labelFunc={() => {
          // allows you to display anything wihtout affecting the value
          return displayValue(value);
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
