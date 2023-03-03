import React, { useRef, useEffect } from "react";
import { KeyboardTimePicker } from "@material-ui/pickers";
import { Chip, Grid, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/pro-solid-svg-icons";
import { parse, isDate, isValid, isEqual } from "date-fns";
import { get } from "lodash";
import { makeStyles } from "@material-ui/styles";

import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import { isEmptyArray } from "formik";

const useStyles = makeStyles((theme) => ({
  timeWrapper: {
    display: "flex",
    flexBasis: "175px",
  },
  recipientsWrapper: {
    display: "flex",
    flex: 1,
  },
  iconDisabled: {
    color: "white",
  },
}));

export default function ReportSection({
  timeDisabled = false,
  name,
  values,
  setFieldValue,
  setFieldError,
  index = 0,
  reportIndex,
  errors,
  timeZone,
}) {
  const classes = useStyles();
  const ref = useRef();

  const [recipients, setValue] = React.useState(values.recipients);

  useEffect(() => {
    ref.current = recipients;
  }, [values, recipients]);

  const handleEmailChange = (event, value, reason) => {
    setValue(value);
    if (reason === "remove-option") {
      setFieldValue("recipients", value);
    }
  };

  const updateRecipients = (values) => {
    const { value = "" } = values.target;
    const splitInput = value.trim().split(" ");
    const filteredInput = splitInput.filter((elem) => elem !== "");
    if (!isEmptyArray(filteredInput)) {
      setFieldValue("recipients", [...recipients, ...filteredInput]);
    } else {
      setFieldValue("recipients", recipients);
    }
  };

  const emailError = () => {
    const emailErrorSelector = `[${reportIndex}].notifications[${index}].recipients`;
    const emailErrors = get(errors, emailErrorSelector, false);

    if (emailErrors && Array.isArray(emailErrors)) {
      const firstError = emailErrors.find((error) => {
        return typeof error !== "undefined" && error !== null;
      });
      return firstError;
    } else if (emailErrors) {
      return emailErrors;
    }
    return "";
  };

  const emailErrorValue = emailError();

  const time = isDate(values.time)
    ? values.time
    : parse(values.time, "HH:mm:ssXXXXX", new Date());

  const tzTime = utcToZonedTime(time, timeZone);

  function handleTimeChange(value) {
    if (isValid(value)) {
      const utcTime = zonedTimeToUtc(value, timeZone);
      // don't update if the time hasn't changed, prevents formik from being dirty
      if (!isEqual(utcTime, time)) {
        const formattedTime = format(utcTime, "HH:mm:ssXXXXX");
        setFieldValue("time", formattedTime);
      }
    }
  }

  const keyboardIcon = (
    <FontAwesomeIcon
      icon={faClock}
      size="1x"
      className={timeDisabled ? classes.iconDisabled : ""}
    />
  );

  return (
    <>
      <Grid item className={classes.timeWrapper}>
        <KeyboardTimePicker
          label="Time"
          name={`${name}Time`}
          disabled={timeDisabled}
          placeholder="10:00 AM"
          mask="__:__ _M"
          inputVariant="outlined"
          value={tzTime}
          required={true}
          inputProps={{
            "data-value": tzTime,
          }}
          inputVariant="outlined"
          id={`rci_settings_${reportIndex}_${name}TimeInput_${index}`}
          keyboardIcon={keyboardIcon}
          onChange={handleTimeChange}
        />
      </Grid>
      <Grid item className={classes.recipientsWrapper}>
        <Autocomplete
          name={`${name}Emails`}
          multiple
          options={[].map((option) => option.title)}
          freeSolo
          fullWidth
          id={`rci_settings_${reportIndex}_${name}Emails_${index}`}
          value={recipients}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Email Addresses *"
              error={emailErrorValue !== ""}
              helperText={emailErrorValue}
            />
          )}
          onBlur={updateRecipients}
          onChange={handleEmailChange}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option} {...getTagProps({ index })} />
            ))
          }
        />
      </Grid>
    </>
  );
}
