/** @format */

import React from 'react';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { isEqual, set, omit, isNil } from 'lodash';
import moment from 'moment-timezone';
import styled from '@emotion/styled';

const TimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 15px 0;
`;

export default function SchedulePlayDates(props) {
  const { values, errors, setFieldValue } = props;
  const rule = values.rule;
  const hasError = errors['rule'] && errors['rule'].dtstart;
  const isIndefinitely = isNil(rule.until);
  const maxDate = moment().add(5, 'years');

  const handleCheckbox = (isChecked) => {
    let updatedRule = { ...rule };
    if (isChecked) {
      updatedRule = omit(updatedRule, 'until');
    } else {
      set(
        updatedRule,
        'until',
        moment(updatedRule.dtstart)
          .endOf('day')
          .toDate(),
      );
    }
    setFieldValue('rule', updatedRule);
  };

  const onDateChange = (date, name) => {
    const isValidDate = moment(date).isValid();
    // allows for keyboard entry
    if (isValidDate) {
      let updatedRule = { ...rule };
      const changedKey = isEqual(name, 'start') ? 'dtstart' : 'until';
      set(updatedRule, changedKey, date.toDate());
      setFieldValue('rule', updatedRule);
    }
  };

  if (rule) {
    return (
      <TimeContainer>
        <KeyboardDateTimePicker
          label="From"
          value={moment(rule.dtstart)}
          onChange={(date) => onDateChange(date, 'start')}
          maxDate={maxDate}
          style={{ marginBottom: 10 }}
          fullWidth
          error={hasError}
          helperText={hasError ? hasError : null}
          format="MM/DD/YYYY hh:mm a"
        />
        <KeyboardDateTimePicker
          label="To"
          value={rule.until ? moment(rule.until) : null}
          onChange={(date) => onDateChange(date, 'end')}
          style={{ marginBottom: 10 }}
          fullWidth
          InputLabelProps={{ shrink: true }}
          format="MM/DD/YYYY hh:mm a"
          disabled={isIndefinitely}
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={isIndefinitely}
              onChange={(e) => handleCheckbox(e.target.checked)}
            />
          }
          label="Play Indefinitely"
        />
      </TimeContainer>
    );
  }
  // if nothing return null
  return null;
}
