/** @format */

import React, { useEffect, useState } from 'react';
import {
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  InputAdornment,
  FormControlLabel,
  Typography,
  Switch,
} from '@material-ui/core';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import {
  AccountCircleOutlined,
  MailOutline,
  PhoneEnabledOutlined,
  ApartmentOutlined,
} from '@material-ui/icons';

import MaskedInput from 'react-text-mask';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { camelCase, isObject, isEmpty, find, values } from 'lodash';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { useFlags, getCommunityId } from '@teamhub/api';
import StaffProfileImageEditor from './StaffProfileImageEditor';
import { useDepartments } from './departmentContext';
import { IntegrationsContext } from '../contexts/IntegrationsProvider';
import IntegrationsWarning from './IntegrationsWarning';

const useFormStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
  },
}));

const useDialogContentStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      flex: 1,
    },
  },
}));

const useGridStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 25,
  },
}));

const useGreyTypography = makeStyles((theme) => ({
  root: {
    color: theme.palette.grey[600],
  },
}));

const useHighlightedTextStyles = makeStyles((theme) => ({
  focused: {
    color: theme.palette.primary.main,
  },
}));

export const FormAction = {
  EDIT: 'edit',
  ADD: 'add',
};

const phoneUtil = PhoneNumberUtil.getInstance();
Yup.addMethod(Yup.string, 'phone', function (message) {
  return this.test('valid-phone', message, function (value) {
    const { path, createError } = this;
    if (isEmpty(value)) return true;
    const cleaned = value.replace(/\D/gi, '');
    const phone = phoneUtil.parse(cleaned, 'US');
    return (
      phoneUtil.isValidNumberForRegion(phone, 'US') ||
      createError({ path, message })
    );
  });
});

Yup.addMethod(Yup.string, 'uniqueEmail', function (errors, message) {
  return this.test('unique-email', message, function (value) {
    const { path, createError } = this;

    const existingEmailError = find(errors, (error) => {
      if (error.extensions?.response?.body.match(/user.*exists/gi)) {
        return true;
      }
    });
    return !existingEmailError || createError({ path, message });
  });
});

export default function StaffMemberForm({
  onSubmit,
  onCancel,
  data,
  action,
  onResetPassword,
}) {
  const flags = useFlags();
  const [submissionErrors, setSubmissionErrors] = useState([]);
  const [departments, setDepartments] = useDepartments();
  const isEdit = action === FormAction.EDIT;
  const formClasses = useFormStyles();
  const dialogContentClasses = useDialogContentStyles();
  const gridClasses = useGridStyles();
  const highlightedTextClasses = useHighlightedTextStyles();

  const { integrations } = React.useContext(IntegrationsContext);
  const { staffIntegrationEnabled = false } = integrations;

  function generateId(component) {
    return `SD_StaffMemberForm-${component}`;
  }

  function handleDepartmentChange(evt, value, setFieldValue, values) {
    if (!value) {
      setFieldValue('staff.department', null);
    } else {
      if (value.new) {
        setDepartments((prev) => [...prev, value.inputValue]);
      }
      setFieldValue('staff.department', value.inputValue || value.name);
    }
  }

  const staffValidationSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    email: Yup.string()
      .email('Email must be a valid email address.')
      .uniqueEmail(submissionErrors, 'Email already exists.'),
    jobTitle: Yup.string().nullable(),
    primaryPhone: Yup.string()
      .phone('Primary phone must be a valid phone number.')
      .nullable(),
    secondaryPhone: Yup.string()
      .phone('Secondary phone must be a valid phone number.')
      .nullable(),
    publicProfile: Yup.boolean(),
    visiblePhone: Yup.boolean(),
    visibleEmail: Yup.boolean(),
  });

  const validationSchema = Yup.object().shape({
    staff: staffValidationSchema,
  });

  function getErrorMessage(errors, touched, name) {
    if (touched.staff && errors.staff) {
      return touched.staff[name] && errors.staff[name];
    }
  }

  async function _onSubmit(values, { setSubmitting, validateForm }) {
    const errors = await onSubmit(values);
    if (errors) {
      setSubmissionErrors(errors);
      await validateForm();
      setSubmissionErrors([]);
    }
    setSubmitting(false);
  }

  function isAllRequiredFieldsFilled(values) {
    return values.firstName && values.lastName && values.email;
  }

  return (
    <Formik
      onSubmit={_onSubmit}
      initialValues={data}
      validationSchema={validationSchema}
    >
      {({
        isSubmitting,
        handleChange,
        values,
        handleSubmit,
        setFieldValue,
        errors,
        touched,
      }) => (
        <Form className={formClasses.root} onSubmit={handleSubmit}>
          <DialogContent classes={dialogContentClasses}>
            <Grid container spacing={2} classes={gridClasses}>
              <Grid
                item
                xs={12}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <StaffProfileImageEditor
                  values={values}
                  handleChange={handleChange}
                  isEdit={isEdit}
                />
              </Grid>
              <Grid item xs={12}>
                <IntegrationsWarning />
              </Grid>
              <Grid item xs={12} sm={6} style={{ paddingBottom: 0 }}>
                <FormInput
                  errorMessage={getErrorMessage(errors, touched, 'firstName')}
                  name="staff.firstName"
                  label="First Name"
                  variant="outlined"
                  id={generateId('field-firstName')}
                  onChange={handleChange}
                  value={values.staff.firstName}
                  Adornment={AccountCircleOutlined}
                />
              </Grid>
              <Grid item xs={12} sm={6} style={{ paddingBottom: 0 }}>
                <FormInput
                  errorMessage={getErrorMessage(errors, touched, 'lastName')}
                  name="staff.lastName"
                  label="Last Name"
                  id={generateId('field-lastName')}
                  onChange={handleChange}
                  value={values.staff.lastName}
                  Adornment={AccountCircleOutlined}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} classes={gridClasses}>
              <Grid item xs={12} sm={6} style={{ paddingBottom: 0 }}>
                <FormInput
                  errorMessage={getErrorMessage(errors, touched, 'email')}
                  name="staff.email"
                  label="Email"
                  id={generateId('field-email')}
                  value={values.staff.email}
                  onChange={handleChange}
                  Adornment={MailOutline}
                  FormHelperTextProps={{
                    classes: highlightedTextClasses,
                  }}
                />
              </Grid>
              {isEdit && (
                <Grid item xs={12} sm={6} style={{ paddingBottom: 0 }}>
                  <Button color="primary" onClick={() => onResetPassword()}>
                    Reset password
                  </Button>
                </Grid>
              )}
            </Grid>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sm={6}
                classes={gridClasses}
                style={{ paddingRight: 9 }}
              >
                <FormInput
                  errorMessage={getErrorMessage(errors, touched, 'jobTitle')}
                  name="staff.jobTitle"
                  label="Job Title (Optional)"
                  id={generateId('field-jobTitle')}
                  value={values.staff.jobTitle}
                  onChange={handleChange}
                  Adornment={ApartmentOutlined}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                classes={gridClasses}
                style={{ paddingRight: 9 }}
              >
                <FormAutocomplete
                  errorMessage={getErrorMessage(errors, touched, 'department')}
                  name="staff.department"
                  label="Department (Optional)"
                  id={generateId('field-department')}
                  value={values.staff.department}
                  onChange={(evt, val) =>
                    handleDepartmentChange(evt, val, setFieldValue, values)
                  }
                  options={departments}
                  Adornment={ApartmentOutlined}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} classes={gridClasses}>
                <PhoneFormInput
                  errorMessage={getErrorMessage(
                    errors,
                    touched,
                    'primaryPhone',
                  )}
                  name="staff.primaryPhone"
                  label="Primary Phone (Optional)"
                  id={generateId('field-primaryPhone')}
                  value={values.staff.primaryPhone}
                  onChange={handleChange}
                  Adornment={PhoneEnabledOutlined}
                />
              </Grid>
              <Grid item xs={12} sm={6} classes={gridClasses}>
                <PhoneFormInput
                  errorMessage={getErrorMessage(
                    errors,
                    touched,
                    'secondaryPhone',
                  )}
                  name="staff.secondaryPhone"
                  value={values.staff.secondaryPhone}
                  onChange={handleChange}
                  id={generateId('field-secondaryPhone')}
                  label="Secondary Phone (Optional)"
                  Adornment={PhoneEnabledOutlined}
                />
              </Grid>
            </Grid>
            {flags['teamhub-staff-reveal-toggles'] ? (
              <Grid container spacing={2}>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="baseline"
                  style={{ marginLeft: '10px' }}
                >
                  <Typography
                    gutterBottom
                    variant="caption"
                    component="legend"
                    style={{ color: 'rgba(0, 0, 0, 0.54)' }}
                  >
                    Visibility
                  </Typography>
                  <VisibilitySwitches
                    values={values}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />
                </Grid>
              </Grid>
            ) : null}
          </DialogContent>

          <DialogActions style={{ paddingBottom: 16, paddingRight: 24 }}>
            <Button
              id={generateId('cancel')}
              disabled={isSubmitting}
              onClick={onCancel}
              color="primary"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              id={generateId('submit')}
              disabled={
                isSubmitting ||
                !isAllRequiredFieldsFilled(values.staff) ||
                staffIntegrationEnabled
              }
              style={{ width: 86 }}
              variant="contained"
              color="primary"
            >
              {isEdit ? 'UPDATE' : 'ADD'}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
}

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        '(',
        /[1-9]/,
        /\d/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      placeholderChar={'\u2000'}
    />
  );
}

function PhoneFormInput({ Adornment, errorMessage, ...props }) {
  const greyType = useGreyTypography();

  return (
    <TextField
      fullWidth
      variant="outlined"
      error={!!errorMessage}
      helperText={errorMessage}
      InputProps={{
        inputComponent: TextMaskCustom,
        startAdornment: (
          <InputAdornment position="start">
            <Adornment classes={greyType} />
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}

const filter = createFilterOptions({ trim: true });
function FormAutocomplete({
  Adornment,
  helperText,
  errorMessage,
  options,
  value,
  ...props
}) {
  const mapOptions = (option) => (isObject(option) ? option : { name: option });
  const mapValue = (value) => {
    if (!value) {
      return null;
    } else {
      return isObject(value) ? value : { name: value };
    }
  };
  const filterOptions = (options, params) => {
    const filtered = filter(options, params);
    if (filtered.length === 0) {
      filtered.push({
        inputValue: params.inputValue,
        name: `Create "${params.inputValue}" department`,
        new: true,
      });
    }
    return filtered;
  };

  const greyType = useGreyTypography();

  return (
    <Autocomplete
      fullWidth
      id={props.id}
      disabled={false}
      variant="outlined"
      value={mapValue(value)}
      error={!!errorMessage}
      defaultValue=""
      onChange={props.onChange}
      noOptionsText={props.noOptionsText}
      getOptionSelected={(option, value) => {
        if (value) {
          return option.name === (value.inputValue || value.name);
        }
      }}
      options={options.map(mapOptions)}
      filterOptions={filterOptions}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.name || '';
      }}
      disablePortal={true}
      helperText={errorMessage || helperText}
      renderOption={(option) => {
        if (option.new) {
          return (
            <Typography
              data-testid="SD_staffmodal-create-department"
              id="SD_staffmodal-create-department"
              color="primary"
            >
              {option.name}
            </Typography>
          );
        } else {
          return (
            <Typography
              id={`SD_staffmodal-department-${camelCase(option.name)}`}
            >
              {option.name}
            </Typography>
          );
        }
      }}
      renderInput={(params) => {
        params.inputProps = { ...params.inputProps, ...props.inputProps };
        params.InputProps = {
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <Adornment classes={greyType} />
            </InputAdornment>
          ),
        };
        return (
          <TextField
            {...params}
            error={props.error}
            color="primary"
            variant="outlined"
            label={props.label}
            placeholder="Enter department"
            helperText={params.inputProps.helperText}
          />
        );
      }}
    />
  );
}

function FormInput({ Adornment, helperText, errorMessage, ...props }) {
  const greyType = useGreyTypography();

  return (
    <TextField
      fullWidth
      disabled={false}
      variant="outlined"
      error={!!errorMessage}
      helperText={errorMessage || helperText}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Adornment classes={greyType} />
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}

function VisibilitySwitches(props) {
  const { values, handleChange, setFieldValue } = props;

  useEffect(() => {
    if (values.staff.publicProfile === false) {
      setFieldValue('staff.visibleEmail', false);
      setFieldValue('staff.visiblePhone', false);
    }
  }, [values.staff.publicProfile, setFieldValue]);

  const getColor = (value) => {
    return value ? 'primary' : 'default ';
  };

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            name="staff.publicProfile"
            checked={values.staff.publicProfile}
            onChange={handleChange}
            color="primary"
            id="SD_StaffMemberForm-publicProfileSwitch"
          />
        }
        label={
          <Typography
            style={{ fontSize: '14px' }}
            color={getColor(values.staff.publicProfile)}
          >
            Make profile public in K4Community Plus
          </Typography>
        }
      />
      {values.staff.publicProfile && (
        <>
          <FormControlLabel
            control={
              <Switch
                name="staff.visibleEmail"
                checked={values.staff.visibleEmail}
                onChange={handleChange}
                color="primary"
                id="SD_StaffMemberForm-visibleEmailSwitch"
              />
            }
            label={
              <Typography
                style={{ fontSize: '14px' }}
                color={getColor(values.staff.visibleEmail)}
              >
                Make email public
              </Typography>
            }
            color="primary"
          />
          <FormControlLabel
            control={
              <Switch
                checked={values.staff.visiblePhone}
                onChange={handleChange}
                name="staff.visiblePhone"
                color="primary"
                id="SD_StaffMemberForm-visiblePhoneSwitch"
              />
            }
            label={
              <Typography
                style={{ fontSize: '14px' }}
                color={getColor(values.staff.visiblePhone)}
              >
                Make phone numbers public
              </Typography>
            }
            color="primary"
          />
        </>
      )}
    </>
  );
}
