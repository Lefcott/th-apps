import React from "react";
import { parse, isDate } from "date-fns";
import { makeStyles } from "@material-ui/styles";
import RCIDivider from "./base/RCIDivider";
import ReportSection from "./ReportSection";
import { formatInTimeZone } from "date-fns-tz";
import { get } from "lodash";

import {
  FormControlLabel,
  Grid,
  Link,
  Switch,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  header: {
    fontWeight: 500,
  },
  description: {
    color: "rgba(0, 0, 0, 0.6)",
  },
  noRightPadding: {
    paddingRight: 0,
  },
  largeTopPadding: {
    marginTop: theme.spacing(2),
  },
  reportWrapper: {
    justifyContent: "space-between",
    gap: theme.spacing(4),
    flexDirection: "row",
  },
}));

export default function RCIReports(props) {
  const {
    index,
    setFieldValue,
    setFieldError,
    values,
    errors,
    timeZone,
  } = props;
  const { window } = values;
  const classes = useStyles();

  function createSetFieldFnByIndex(key, innerIndex) {
    return (field, value) => {
      setFieldValue(`[${index}].${key}[${innerIndex}].${field}`, value);
    };
  }

  function createSetFieldErrByIndex(key, innerIndex) {
    return (field, error) => {
      setFieldError(`[${index}].${key}[${innerIndex}].${field}`, error);
    };
  }

  const handleSecondReportToggle = (event) => {
    setFieldValue(`[${index}].notifications[1].enabled`, event.target.checked);
  };

  const checkInWindow = () => {
    const startParsed = parse(window.start, "HH:mm:ssXXXXX", new Date());
    const endParsed = parse(window.end, "HH:mm:ssXXXXX", new Date());
    const start = formatInTimeZone(startParsed, timeZone, "haaa");
    const end = formatInTimeZone(endParsed, timeZone, "haaa");

    return (
      <Grid item xs={12}>
        <Typography className={classes.header} variant="subtitle1">
          Check-in Window: {start} to {end}
        </Typography>
      </Grid>
    );
  };

  const { time: firstReportTime } = values.notifications[0];

  const parsedFirstReportTime = isDate(firstReportTime)
    ? firstReportTime
    : parse(firstReportTime, "HH:mm:ssXXXXX", new Date());

  const formattedFirstReportTime = formatInTimeZone(
    parsedFirstReportTime,
    timeZone,
    "haaa"
  );

  const secondReportEnabled = get(values, `notifications[1].enabled`, false);

  return (
    <>
      <RCIDivider />
      {checkInWindow()}
      <Grid item xs={12}>
        <Typography>First Report</Typography>
      </Grid>
      <Grid item xs={12} className={classes.bottomPaddingMd}>
        <Typography className={classes.description}>
          A report will be emailed at {formattedFirstReportTime} of all active
          residents not seen active during the check-in window.
        </Typography>
        <Typography className={classes.description}>
          To update the check-in window, contact{" "}
          <Link href="mailto:support@k4connect.com">support@k4connect.com</Link>
          .
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        className={[
          classes.noRightPadding,
          classes.largeTopPadding,
          classes.reportWrapper,
        ].join(" ")}
      >
        <ReportSection
          timeDisabled={true}
          name={"firstReport"}
          values={values.notifications[0]}
          setFieldValue={createSetFieldFnByIndex("notifications", 0)}
          setFieldError={createSetFieldErrByIndex("notifications", 0)}
          index={0}
          reportIndex={index}
          errors={errors}
          timeZone={timeZone}
        />
      </Grid>
      <Grid item xs={12} className={classes.largeTopPadding}>
        <FormControlLabel
          control={
            <Switch
              name="rciSettings.secondReportEnabled"
              checked={secondReportEnabled}
              onChange={handleSecondReportToggle}
              color="primary"
            />
          }
          label={"Second Report"}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography className={classes.description}>
          A second report will be emailed of all remaining unresolved alerts at
          the specified time.
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        className={[
          classes.noRightPadding,
          classes.largeTopPadding,
          classes.reportWrapper,
        ].join(" ")}
      >
        {secondReportEnabled && <ReportSection
          name="secondReport"
          values={values.notifications[1]}
          setFieldValue={createSetFieldFnByIndex("notifications", 1)}
          setFieldError={createSetFieldErrByIndex("notifications", 1)}
          index={1}
          reportIndex={index}
          errors={errors}
          timeZone={timeZone}
        />}
      </Grid>
    </>
  );
}
