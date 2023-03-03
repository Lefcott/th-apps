/** @format */

import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { DateTime } from 'luxon';
import { withStyles } from '@material-ui/styles';
import { get } from 'lodash';

const HeaderContainer = withStyles({
  root: {
    background: 'rgba(235, 235, 235, 1)',
    display: 'flex',
    borderRadius: '4px',
    lineHeight: '12px',
    color: 'rgba(0, 0, 0, 0.87)',
  },
})(Box);

const HeaderMealName = withStyles({
  root: {
    fontSize: '12px',
  },
})(Typography);

const HeaderMealTime = withStyles({
  root: {
    marginLeft: '0.5rem',
    fontSize: '12px',
  },
})(Typography);

export default function MenuCalendarMealHeader({ meal }) {
  function getFormat(time) {
    return time.minute ? (time.minute > 9 ? 'h:ma' : 'h:mma') : 'ha';
  }

  function getTimeRange() {
    const { availability } = meal;
    const start = DateTime.fromISO(get(availability, 'start'));
    const end = DateTime.fromISO(get(availability, 'end'));

    if (!start.isValid || !end.isValid) {
      return '';
    }
    return `(${start.toFormat(getFormat(start))} TO ${end.toFormat(
      getFormat(end)
    )})`;
  }

  return (
    <HeaderContainer px={1.5} py={0.75} id="MD_Meal-Name-Header">
      <HeaderMealName>{meal.name} </HeaderMealName>
      <HeaderMealTime>{getTimeRange()}</HeaderMealTime>
    </HeaderContainer>
  );
}
