/** @format */

import React from 'react';
import { Box } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const Label = withStyles({
  root: {
    fontSize: '14px',
  },
})(Box);

export default function MenuCalendarWeekDays() {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return (
    <Box display="flex">
      {days.map((day) => (
        <Label textAlign="center" p={2} pt={0} flex={1} key={day}>
          {day}
        </Label>
      ))}
    </Box>
  );
}
