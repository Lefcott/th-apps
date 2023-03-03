/** @format */

import React from 'react';
import { FormSelect } from '../utils/formComponents';
import { Typography, Box } from '@material-ui/core';
import strings from '../constants/strings';

export default function DownloadEventsCalendarSelector({
  value,
  options = [],
  onChange,
  variant,
}) {
  const handleCalendarChange = (value) => {
    onChange(value);
  };

  React.useEffect(() => {
    // on inital render all calendars are selected by default
    onChange(options);
    // eslint-disable-next-line
  }, [options.length]);

  const calendarOptions = options.map((item) => ({
    id: item._id,
    displayText: item.name,
    value: item,
    getChecked(value, option) {
      return !!value.find((calendar) => calendar._id === option.id);
    },
  }));

  const valueRenderer = (value, i, values) => {
    const text = i === values.length - 1 ? value.name : `${value.name},`;

    return (
      <Typography
        key={value._id}
        display="block"
        variant="body1"
        style={{ marginRight: '0.25rem' }}
      >
        {text}
      </Typography>
    );
  };

  return (
    <Box mt={2}>
      <FormSelect
        multiple
        variant={variant}
        value={value}
        label={strings.Event.inputs.calendars}
        id="EM_calendar-filter"
        options={calendarOptions}
        valueRenderer={valueRenderer}
        onChange={handleCalendarChange}
        selectAllOptionDisplayText={strings.Event.inputs.allCalendars}
      />
    </Box>
  );
}
