import React from 'react';
import moment from 'moment-timezone';
import { isEqual } from 'lodash';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { Grid, TextField, MenuItem } from '@material-ui/core';

const allDayDuration = '1440';

function ScheduleDuration(props) {
  const { values, errors, setFieldValue } = props;
  const rule = values.rule;
  const hasError = errors['rule'] && errors['rule'].duration;
  const durationVal = isEqual(rule.duration, allDayDuration)
    ? 'allDay'
    : 'scheduled';

  const getStartTime = () => {
    const hour = rule.byhour || 0;
    const minute = rule.byminute || 0;
    return moment()
      .hour(hour)
      .minute(minute);
  };

  const getEndTime = () => {
    const startTime = getStartTime();
    let duration = rule.duration || allDayDuration;
    if (duration === allDayDuration) duration--;
    return moment(startTime).add(duration, 'minutes');
  };

  const selectOnChange = name => {
    let updatedRule = { ...rule };
    if (isEqual(name, 'allDay')) {
      updatedRule.duration = allDayDuration;
      delete updatedRule.byhour;
      delete updatedRule.byminute;
    } else {
      // default schedule will be 8am - 5pm
      updatedRule.byhour = 8;
      updatedRule.byminute = 0;
      updatedRule.duration = '540';
    }
    setFieldValue('rule', updatedRule);
  };

  const calculateDuration = (start, newTime, duration) => {
    const minuteDifference =
      (newTime.hour - start.hour) * 60 + (newTime.minute - start.minute);
    return duration - minuteDifference;
  };

  const timeOnChange = (date, name) => {
    const isValidDate = moment(date).isValid();
    // allows for keyboard entry
    if (isValidDate) {
      const hour = moment(date).hour();
      const minute = moment(date).minute();
      let updatedRule = rule;
      let newDuration;

      if (isEqual(name, 'start')) {
        // update to the start time
        newDuration = calculateDuration(
          { hour: rule.byhour, minute: rule.byminute },
          { hour, minute },
          rule.duration
        );
        updatedRule.byhour = hour;
        updatedRule.byminute = minute;
      } else {
        // update to the end time
        newDuration = (hour - rule.byhour) * 60 + (minute - rule.byminute);
      }
      updatedRule.duration = newDuration;

      setFieldValue('rule', updatedRule);
    }
  };

  return (
    <Grid container style={{ margin: '15px 0' }}>
      <Grid item xs={12}>
        <TextField
          select
          name="duration"
          label="Duration Options"
          fullWidth
          value={durationVal}
          onChange={e => selectOnChange(e.target.value)}
        >
          <MenuItem value="allDay">Play all day (12:00 am - 11:59 pm)</MenuItem>
          <MenuItem value="scheduled">Same time each day</MenuItem>
        </TextField>
      </Grid>

      {isEqual(durationVal, 'scheduled') ? (
        <Grid container style={{ marginTop: 10 }}>
          <Grid item xs={12} sm={6}>
            <KeyboardTimePicker
              label="Starting at"
              format="hh:mm a"
              error={hasError}
              helperText={hasError ? hasError : null}
              value={getStartTime()}
              onChange={date => timeOnChange(date, 'start')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <KeyboardTimePicker
              label="Ending at"
              format="hh:mm a"
              value={getEndTime()}
              onChange={date => timeOnChange(date, 'end')}
            />
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
}

export default ScheduleDuration;
