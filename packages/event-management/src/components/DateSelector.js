/** @format */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DateMomentUtils from '@date-io/moment';
import moment from 'moment-timezone';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { InputAdornment, Grid } from '@material-ui/core';
import { Event } from '@material-ui/icons';
import strings from '../constants/strings';

export default function DateSelector(props) {
  const [startDate, setStartDate] = useState(
    props.startDate ? moment(props.startDate) : moment(),
  );
  const [endDate, setEndDate] = useState(
    props.endDate ? moment(props.endDate) : null,
  );

  const { handler } = props;
  useEffect(() => {
    handler(startDate.startOf('day'), 'startDate');
  }, [startDate]);

  useEffect(() => {
    handler(endDate.endOf('day'), 'endDate');
  }, [endDate]);

  useEffect(() => {
    setEndDate(props.endDate);
  }, [props.endDate]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...props.style,
      }}
    >
      <MuiPickersUtilsProvider utils={DateMomentUtils}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <DatePicker
              inputVariant="outlined"
              id="EM_publishall-datepicker-startDate"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              label={strings.Event.inputs.startDate}
              format="MM/DD/YYYY"
              autoOk
              InputProps={{
                variant: 'outlined',
                style: {
                  cursor: 'pointer',
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <Event fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              id="EM_publishall-datepicker-endDate"
              inputVariant="outlined"
              value={endDate}
              label={strings.Event.inputs.endDate}
              fullWidth
              autoOk
              onChange={(date) => setEndDate(date)}
              format="MM/DD/YYYY"
              minDate={startDate}
              InputProps={{
                style: {
                  cursor: 'pointer',
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <Event fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    </div>
  );
}

DateSelector.propTypes = {
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  handler: PropTypes.func,
};
