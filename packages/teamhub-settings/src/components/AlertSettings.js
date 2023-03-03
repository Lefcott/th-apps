import React from "react";
import { get } from "lodash";
import MaskedInput from "react-text-mask";
import {
  Box,
  Grid,
  Divider,
  Typography,
  FormControlLabel,
  Switch,
  FormHelperText,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import {
  HighlightOff,
  AddCircleOutline,
  PhoneEnabledOutlined,
} from "@material-ui/icons";
import { useFlags } from "@teamhub/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureFrigid,
  faTemperatureHot,
} from "@fortawesome/pro-regular-svg-icons";
import { FieldArray, Field } from "formik";
import { idGenerator } from "../utils";
import * as yup from "yup";
import { PhoneNumberUtil } from "google-libphonenumber";
import "yup-phone";

const phoneUtil = PhoneNumberUtil.getInstance();

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
  helperText: {
    fontSize: "0.9rem",
    color: theme.palette.grey[600],
  },
  requiredMessage: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    color: theme.palette.grey[500],
  },
  content: {
    marginTop: "1rem",
  },
  textField: {
    color: "#666666",
  },
  input: {
    width: theme.breakpoints.down("sm") ? "110px" : "100%",
  },
  textFieldHelperText: {
    marginLeft: 0,
    marginRight: "0 !important",
  },
  phoneInput: {
    width: "180px",
  },
  startAdornment: {
    color: "#666666",
    marginRight: "0.5rem",
  },
  phoneNumberRemoveButton: {
    "& :hover": {
      color: theme.palette.primary.main,
    },
  },
}));

function SensorRequiredMessage({ text }) {
  return <Typography variant="caption">{text}</Typography>;
}

function PaddedDivider({ noTopMargin }) {
  return (
    <Box my={2} mt={noTopMargin ? 0 : 2}>
      <Divider />
    </Box>
  );
}

function PhoneInputMask({ inputRef, ...others }) {
  return (
    <MaskedInput
      {...others}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      guide={false}
      mask={[
        "(",
        /[1-9]/,
        /\d/,
        /\d/,
        ")",
        " ",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      showMask
      placeholderChar={"\u2000"}
    />
  );
}

function PhoneDisplayField({ classes, field, form, ...props }) {
  return (
    <TextField
      {...field}
      {...props}
      variant="outlined"
      label="Phone Number"
      InputProps={{
        className: classes.phoneInput,
        inputComponent: PhoneInputMask,
        startAdornment: (
          <InputAdornment className={classes.startAdornment}>
            <PhoneEnabledOutlined />
          </InputAdornment>
        ),
      }}
    />
  );
}

function ToggleSettings({
  enabled,
  onChange,
  name,
  label,
  requiredMessage,
  helperText,
  children,
  classes,
}) {
  const idGen = idGenerator.createWithAppendedPrefix("ToggleSettings");
  return (
    <>
      <Grid container className={classes.container}>
        <Grid item md={9}>
          <FormControlLabel
            control={
              <Switch
                name={name}
                checked={enabled}
                onChange={onChange}
                color="primary"
                id={idGen.getId(name)}
              />
            }
            label={label}
          />
        </Grid>
        <Grid item md={3} className={classes.requiredMessage}>
          <SensorRequiredMessage text={requiredMessage} />
        </Grid>
      </Grid>

      {enabled && (
        <Grid container>
          <Grid item xs={12}>
            <FormHelperText className={classes.helperText}>
              {helperText}
            </FormHelperText>
          </Grid>

          {children && (
            <Grid item xs={12} className={classes.content}>
              {children}
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}

const MAX_TEMP = 99;
const MIN_TEMP = 32;

export const createAlertSettingsInitialValues = (settings) => {
  const { __typename, ...currentSettings } = settings || {};

  return {
    ovenAlertEnabled: false,
    ovenAlertDurationThreshold: 4,
    lowTempAlertEnabled: false,
    lowTempAlertThreshold: 65,
    highTempAlertEnabled: false,
    highTempAlertThreshold: 85,
    leakAlertEnabled: false,
    alertNotificationEnabled: false,
    alertNotificationPhoneNumbers: [],
    ...currentSettings,
  };
};

export const validateAlertSettings = (settings) => {
  const { deviceAlerts } = settings;
  if (
    deviceAlerts.lowTempAlertThreshold < MIN_TEMP ||
    deviceAlerts.lowTempAlertThreshold > MAX_TEMP
  ) {
    deviceAlerts.lowTempAlertThreshold = 65;
  }

  if (
    deviceAlerts.highTempAlertThreshold < MIN_TEMP ||
    deviceAlerts.highTempAlertThreshold > MAX_TEMP
  ) {
    deviceAlerts.highTempAlertThreshold = 85;
  }
  deviceAlerts.alertNotificationPhoneNumbers = deviceAlerts.alertNotificationPhoneNumbers.filter(
    (num) => {
      try {
        return (
          num &&
          phoneUtil.isValidNumberForRegion(phoneUtil.parse(num, "US"), "US")
        );
      } catch (e) {
        return false;
      }
    }
  );
};

yup.addMethod(yup.array, "uniquePhoneNumber", function (message, path) {
  return this.test("unique", message, function (list) {
    const numbers = list.map((num) => phoneUtil.parse(num, "US"));
    const set = [...new Set(numbers)];
    const isUnique = list.length === set.length;
    if (isUnique) {
      return true;
    }

    const idx = list.findIndex((l, i) => l !== set[i]);
    return this.createError({ path: `[${idx}].${path}`, message });
  });
});

function onlyNumber(name, setFieldValue) {
  return (ev) => {
    const { value } = ev.target;
    if (value === "") {
      setFieldValue(name, value);
    } else if (value.match(/^[0-9]*$/g)) {
      setFieldValue(name, parseInt(value));
    }
  };
}

export const createAlertSettingsValidationSchema = () =>
  yup.object().shape({
    ovenAlertEnabled: yup.bool().default(false),
    lowTempAlertEnabled: yup.bool().default(false),
    lowTempAlertThreshold: yup
      .number()
      .when("lowTempAlertEnabled", (lowTempAlertEnabled, schema) => {
        return !lowTempAlertEnabled
          ? schema
          : schema
              .required("Temperature cannot be empty.")
              .min(MIN_TEMP, "Temperature must be higher than 31 °F.")
              .max(MAX_TEMP, "Temperature must be lower than 100 °F.");
      }),
    highTempAlertEnabled: yup.bool().default(false),
    highTempAlertThreshold: yup
      .number()
      .when("highTempAlertEnabled", (highTempAlertEnabled, schema) => {
        return !highTempAlertEnabled
          ? schema
          : schema
              .required("Temperature cannot be empty.")
              .max(MAX_TEMP, "Temperature must be lower than 100 °F.")
              .when("lowTempAlertEnabled", {
                is: false,
                then: schema.min(
                  MIN_TEMP,
                  "Temperature must be higher than 31 °F."
                ),
              })
              .test("check-enabled-min", function (val) {
                const {
                  highTempAlertEnabled,
                  lowTempAlertEnabled,
                  lowTempAlertThreshold,
                } = this.parent;
                if (
                  !highTempAlertEnabled ||
                  !lowTempAlertEnabled ||
                  val > lowTempAlertThreshold ||
                  lowTempAlertThreshold > 99
                ) {
                  return true;
                }

                if (lowTempAlertThreshold && val === lowTempAlertThreshold) {
                  return this.createError({
                    message: `Temperature must be higher than ${lowTempAlertThreshold} °F.`,
                    path: "deviceAlerts.highTempAlertThreshold",
                  });
                }

                return this.createError({
                  message: `Temperature must be higher than ${lowTempAlertThreshold} °F.`,
                  path: "deviceAlerts.highTempAlertThreshold",
                });
              });
      }),
    alertNotificationEnabled: yup.bool().default(false),
    alertNotificationPhoneNumbers: yup
      .array()
      .when("alertNotificationEnabled", (alertNotificationEnabled, schema) => {
        return !alertNotificationEnabled
          ? schema
          : schema.of(
              yup
                .string()
                .phone("US", false, "Must be a valid phone number.")
                .required()
            );
      })
      .default([]),
  });

const DEVICE_ALERT_FLAGS = {
  LEAK: "teamhub-device-alerts-leak",
  OVEN: "teamhub-device-alerts-oven",
  THERMOSTAT: "teamhub-device-alerts-thermostats",
};

export default function AlertSettings({ formik }) {
  const flags = useFlags();
  const idGen = idGenerator.createWithAppendedPrefix("AlertSettings");
  const classes = useStyles();
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
  } = formik;
  const settings = values.deviceAlerts;

  function getPhoneError(touched, errors, index) {
    return (
      get(touched, `deviceAlerts.alertNotificationPhoneNumbers[${index}]`) &&
      get(errors, `deviceAlerts.alertNotificationPhoneNumbers[${index}]`)
    );
  }

  return (
    <Box width="100%">
      <PaddedDivider noTopMargin />
      {flags[DEVICE_ALERT_FLAGS.OVEN] && (
        <>
          <ToggleSettings
            name="deviceAlerts.ovenAlertEnabled"
            enabled={settings.ovenAlertEnabled}
            classes={classes}
            onChange={handleChange}
            label="Oven/Stove Alert"
            requiredMessage="Requires installed oven sensor"
            helperText={`An alert will be sent if an oven is left on longer than ${settings.ovenAlertDurationThreshold} hours.`}
          />
          <PaddedDivider />
        </>
      )}
      {flags[DEVICE_ALERT_FLAGS.THERMOSTAT] && (
        <>
          <ToggleSettings
            name="deviceAlerts.lowTempAlertEnabled"
            enabled={settings.lowTempAlertEnabled}
            classes={classes}
            onChange={handleChange}
            label="Low Temperature Alert"
            requiredMessage="Requires installed thermostat"
            helperText="An alert will be sent if the temperature in a resident's room is below:"
          >
            <TextField
              id={idGen.getId("lowTempAlertThreshold")}
              name="deviceAlerts.lowTempAlertThreshold"
              variant="outlined"
              label="Temperature"
              onChange={onlyNumber(
                "deviceAlerts.lowTempAlertThreshold",
                setFieldValue
              )}
              value={settings.lowTempAlertThreshold}
              className={classes.textField}
              onBlur={handleBlur}
              helperText={
                get(touched, "deviceAlerts.lowTempAlertThreshold") &&
                get(errors, "deviceAlerts.lowTempAlertThreshold")
              }
              error={
                get(touched, "deviceAlerts.lowTempAlertThreshold") &&
                !!get(errors, "deviceAlerts.lowTempAlertThreshold")
              }
              FormHelperTextProps={{
                className: classes.textFieldHelperText,
              }}
              InputProps={{
                className: classes.input,
                inputProps: {
                  className: classes.input,
                },
                startAdornment: (
                  <InputAdornment className={classes.startAdornment}>
                    <FontAwesomeIcon icon={faTemperatureFrigid} size="lg" />
                  </InputAdornment>
                ),
              }}
            />
          </ToggleSettings>
          <PaddedDivider />
          <ToggleSettings
            name="deviceAlerts.highTempAlertEnabled"
            classes={classes}
            onChange={handleChange}
            enabled={settings.highTempAlertEnabled}
            label="High Temperature Alert"
            requiredMessage="Requires installed thermostat"
            helperText="An alert will be sent if the temperature in a resident's room is above:"
          >
            <TextField
              id={idGen.getId("highTempAlertThreshold")}
              name="deviceAlerts.highTempAlertThreshold"
              label="Temperature"
              variant="outlined"
              onChange={onlyNumber(
                "deviceAlerts.highTempAlertThreshold",
                setFieldValue
              )}
              onBlur={handleBlur}
              helperText={
                get(touched, "deviceAlerts.highTempAlertThreshold") &&
                get(errors, "deviceAlerts.highTempAlertThreshold")
              }
              error={
                get(touched, "deviceAlerts.highTempAlertThreshold") &&
                !!get(errors, "deviceAlerts.highTempAlertThreshold")
              }
              className={classes.textField}
              value={settings.highTempAlertThreshold}
              FormHelperTextProps={{
                className: classes.textFieldHelperText,
              }}
              InputProps={{
                className: classes.input,
                inputProps: {
                  className: classes.input,
                },
                startAdornment: (
                  <InputAdornment className={classes.startAdornment}>
                    <FontAwesomeIcon icon={faTemperatureHot} size="lg" />
                  </InputAdornment>
                ),
              }}
            />
          </ToggleSettings>
          <PaddedDivider />
        </>
      )}
      {flags[DEVICE_ALERT_FLAGS.LEAK] && (
        <>
          <ToggleSettings
            name="deviceAlerts.leakAlertEnabled"
            enabled={settings.leakAlertEnabled}
            classes={classes}
            onChange={handleChange}
            label="Leak Alert"
            requiredMessage="Requires installed leak sensor"
            helperText="An alert will be sent if a leak sensor detects the presence of water."
          />
          <PaddedDivider />
        </>
      )}
      <ToggleSettings
        name="deviceAlerts.alertNotificationEnabled"
        enabled={settings.alertNotificationEnabled}
        classes={classes}
        onChange={handleChange}
        label="Notifications"
        helperText="Text message (SMS) alerts will be sent to the following numbers (up to 10 allowed):"
      >
        <FieldArray
          name="deviceAlerts.alertNotificationPhoneNumbers"
          render={(arrayHelpers) => (
            <>
              {settings.alertNotificationPhoneNumbers.map((_, index) => (
                <Grid container key={index}>
                  <Grid item>
                    <Box mt={2}>
                      <Field
                        classes={classes}
                        id={idGen.getId(
                          `alertNotificationPhoneNumbers-${index}`
                        )}
                        name={`deviceAlerts.alertNotificationPhoneNumbers.${index}`}
                        component={PhoneDisplayField}
                        FormHelperTextProps={{
                          className: classes.textFieldHelperText,
                        }}
                        helperText={getPhoneError(touched, errors, index)}
                        error={!!getPhoneError(touched, errors, index)}
                      />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box
                      ml={1}
                      mt={getPhoneError(touched, errors, index) ? 0 : 1}
                      display="flex"
                      alignItems="center"
                      height="100%"
                    >
                      <IconButton
                        size="small"
                        aria-label="phone-number-delete"
                        id={idGen.getId(
                          `deviceAlerts.alertNotificationPhoneNumbers[${index}]-remove-button`
                        )}
                        className={classes.phoneNumberRemoveButton}
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        <HighlightOff />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              ))}
              {settings.alertNotificationPhoneNumbers.length < 10 && (
                <Grid container>
                  <Grid item xs={12}>
                    <Button
                      size="small"
                      color="primary"
                      id={idGen.getId(
                        "deviceAlerts.alertNotificationPhoneNumbers-new"
                      )}
                      onClick={() => arrayHelpers.push("")}
                      startIcon={<AddCircleOutline />}
                    >
                      Add Phone Number
                    </Button>
                  </Grid>
                </Grid>
              )}
            </>
          )}
        />
      </ToggleSettings>
    </Box>
  );
}
