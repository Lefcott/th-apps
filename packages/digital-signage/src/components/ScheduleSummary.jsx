/** @format */

import React from 'react';
import moment from 'moment-timezone';
import { isEqual, isNil, isObject } from 'lodash';
import { Grid, Paper, Typography } from '@material-ui/core';
import styled from '@emotion/styled';

const allDayDuration = '1440';
let daysOfWeek = {
  0: 'Mondays',
  1: 'Tuesdays',
  2: 'Wednesdays',
  3: 'Thursdays',
  4: 'Fridays',
  5: 'Saturdays',
  6: 'Sundays',
};
const ordinals = ['', 'first', 'second', 'third', 'fourth', 'fifth'];
const numerals = ['', 'one', 'two', 'three', 'four', 'five'];

const RedSummaryText = styled.span`
  color: #cc4c3b;
  font-weight: bold;
`;

const SummaryHeader = styled.span`
  font-size: 1.8em;
  font-weight: bold;
`;

function ScheduleSummary(props) {
  const { values } = props;
  const { rule, destinations } = values;
  const destinationNames = destinations.map((dest) => dest.name).join(', ');

  const datesStr = () => {
    const startDate = moment(rule.dtstart).format('MMM Do, h:mm A');
    let string = startDate;
    if (rule.until) {
      const endDate = moment(rule.until).format('MMM Do, h:mm A');
      string += ` - ${endDate}`;
    } else {
      string += ' and playing indefinitely';
    }
    return string;
  };

  const scheduleStr = () => {
    let string;
    // if there's no existing rule duration
    // we must default to all day
    if (isNil(rule.duration)) {
      rule.duration = allDayDuration;
    }
    if (isEqual(rule.duration, allDayDuration)) {
      string = 'Playing all day';
    } else {
      // default to 0s in case a malformed rule comes through, to allow for editing
      // this is only a problem seemingly when byhour and byminue are undefined, which
      // cause the moment chain to blow up
      const startDate = moment()
        .hour(rule.byhour || 0)
        .minute(rule.byminute || 0);
      const endTime = moment(startDate).add(rule.duration, 'm');
      string = `From ${startDate.format('h:mm A')} to ${endTime.format(
        'h:mm A',
      )}`;
    }
    return string;
  };

  const repeatStr = () => {
    let string;
    switch (rule.freq) {
      case 3:
        string = 'Daily';
        break;
      case 2:
        string = isEqual(rule.interval, 1)
          ? 'Weekly'
          : `Every ${numerals[rule.interval]} weeks`;
        if (rule.byweekday) {
          string += ` on ${daysOfWeeker(rule.byweekday)}`;
        }
        break;
      case 1:
        if (
          rule.byweekday &&
          rule.byweekday[0] &&
          isObject(rule.byweekday[0])
        ) {
          const day = rule.byweekday[0].weekday;
          string = `Every ${ordinals[rule.bysetpos]} ${daysOfWeek[day].slice(
            0,
            -1,
          )} of the month`;
        } else {
          string = `Monthly on the ${moment(rule.dtstart).format('Do')}`;
        }
        break;
      default:
        string = '';
        break;
    }
    return string;
  };

  const daysOfWeeker = (arrOfDays) => {
    const mappedDays = arrOfDays
      .sort((a, b) => a.weekday - b.weekday)
      .map((day) => daysOfWeek[day.weekday]);
    return mappedDays.reduce((prev, current, index, arr) => {
      if (arr.length === 1) {
        return current;
      }
      if (index === arr.length - 2) {
        prev = prev + current + ' and ';
      } else if (index === arr.length - 1) {
        prev = prev + current;
      } else {
        prev = prev + current + ', ';
      }
      return prev;
    }, '');
  };

  return (
    <Grid
      container
      justify="flex-start"
      alignItems="center"
      style={{ padding: '1em' }}
    >
      <Paper elevation={6} style={{ padding: 20, width: '100%' }}>
        <SummaryHeader>Summary</SummaryHeader>
        <Typography style={{ marginTop: 5 }}>
          Destinations: <RedSummaryText>{destinationNames}</RedSummaryText>
        </Typography>
        <Typography>
          Dates: <RedSummaryText>{datesStr()}</RedSummaryText>
        </Typography>
        <Typography>
          Schedule: <RedSummaryText>{scheduleStr()}</RedSummaryText>
        </Typography>
        <Typography variant="body1" component="h3">
          Repeat: <RedSummaryText>{repeatStr()}</RedSummaryText>
        </Typography>
      </Paper>
    </Grid>
  );
}

export default ScheduleSummary;
