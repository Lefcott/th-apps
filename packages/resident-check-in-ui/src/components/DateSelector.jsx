import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DateMomentUtils from "@date-io/moment";
import moment from "moment-timezone";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { InputAdornment, Grid } from "@material-ui/core";
import { Event } from "@material-ui/icons";

export default function DateSelector(props) {
  const [startDate, setStartDate] = useState(
    props.startDate ? moment(props.startDate) : moment()
  );
  const [endDate, setEndDate] = useState(
    props.endDate ? moment(props.endDate) : null
  );
  const currentDate = moment();

  const theme = useTheme();
  const { handler, minStartDate } = props;

  let maxStartDate = endDate;
  if (minStartDate) {
    maxStartDate = endDate?.isAfter(minStartDate) ? endDate : undefined;
  }

  useEffect(() => {
    handler([startDate, endDate]);
  }, [startDate, endDate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ...props.style,
      }}
    >
      <MuiPickersUtilsProvider utils={DateMomentUtils}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <DatePicker
              style={{
                paddingRight: useMediaQuery(theme.breakpoints.up("md"))
                  ? "10px"
                  : "0px",
              }}
              id="Rci_datepicker-startDate"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              label="From"
              format="MM/DD/YYYY"
              autoOk
              fullWidth
              minDate={minStartDate}
              maxDate={maxStartDate}
              helperText="Start of Day"
              InputProps={{
                style: {
                  cursor: "pointer",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <Event />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              id="Rci_datepicker-endDate"
              value={endDate}
              clearable
              label="To"
              fullWidth
              autoOk
              onChange={(date) => setEndDate(date)}
              format="MM/DD/YYYY"
              helperText="End of Day"
              minDate={startDate}
              InputProps={{
                style: {
                  cursor: "pointer",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <Event />
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
  minStartDate: PropTypes.object,
  endDate: PropTypes.object,
  handler: PropTypes.func,
};
