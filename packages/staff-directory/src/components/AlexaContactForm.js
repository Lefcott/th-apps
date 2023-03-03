/** @format */

import React from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  InputAdornment,
  Typography,
} from '@material-ui/core';
import { PhoneEnabledOutlined } from '@material-ui/icons';
import MaskedInput from 'react-text-mask';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { isEmpty } from 'lodash';
import { PhoneNumberUtil } from 'google-libphonenumber';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';
import BaseLoader from './base/BaseLoader';

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
    marginBottom: 15,
  },
}));

const useGreyTypography = makeStyles((theme) => ({
  root: {
    color: theme.palette.grey[600],
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

Yup.addMethod(Yup.string, 'uniqueName', function (contacts, index, message) {
  return this.test('unique-name', message, function (value) {
    const { path, createError } = this;
    if (isEmpty(value)) return true;

    const exists = contacts.find(
      (c, idx) => idx !== index && c.name.toLowerCase() === value.toLowerCase(),
    );

    return !exists || createError({ path, message });
  });
});

Yup.addMethod(Yup.string, 'uniquePhone', function (contacts, index, message) {
  return this.test('unique-name', message, function (value) {
    const { path, createError } = this;
    if (isEmpty(value)) return true;

    const cleaned = value.replace(/\D/gi, '');
    const exists = contacts.find(
      (c, idx) => index !== idx && c.phoneNumbers.find((p) => p === cleaned),
    );

    return !exists || createError({ path, message });
  });
});

export default function AlexaMemberForm({
  onSubmit,
  onCancel,
  data,
  contacts,
  action,
  index,
  maxLimitReached,
}) {
  const isEdit = action === FormAction.EDIT;
  const formClasses = useFormStyles();
  const dialogContentClasses = useDialogContentStyles();
  const gridClasses = useGridStyles();

  function generateId(component) {
    return `SD_AlexaContactForm-${component}`;
  }

  function getErrorMessage(errors, touched, name) {
    if (touched && errors) {
      return touched[name] && errors[name];
    }
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .uniqueName(contacts, index, 'Contact name already exists.')
      .required('Contact name cannot be empty.'),

    phoneNumber: Yup.string()
      .phone('Primary phone must be a valid phone number.')
      .uniquePhone(contacts, index, 'Phone number already exists.')
      .required('Primary phone cannot be empty.'),
  });

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={data}
      validationSchema={validationSchema}
    >
      {({
        isSubmitting,
        handleChange,
        values,
        handleSubmit,
        handleBlur,
        errors,
        touched,
      }) => (
        <Form className={formClasses.root} onSubmit={handleSubmit}>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Alexa Contact</DialogTitle>
          {maxLimitReached ? (
            <>
              <DialogContent classes={dialogContentClasses}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} classes={gridClasses}>
                    <Typography>
                      Maximum of 10 Alexa contacts created. Remove an existing
                      Alexa contact to add more.
                    </Typography>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions style={{ paddingBottom: 16, paddingRight: 24 }}>
                <Button
                  id={generateId('cancel')}
                  disabled={isSubmitting}
                  onClick={onCancel}
                  variant="contained"
                  color="primary"
                >
                  CANCEL
                </Button>
              </DialogActions>
            </>
          ) : (
            <>
              <DialogContent classes={dialogContentClasses}>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    /** @format */ classes={gridClasses}
                  >
                    <FormInput
                      onBlur={handleBlur}
                      errorMessage={getErrorMessage(errors, touched, 'name')}
                      name="name"
                      label="Name"
                      variant="outlined"
                      id={generateId('field-firstName')}
                      onChange={handleChange}
                      value={values.name}
                      Adornment={() => <FontAwesomeIcon icon={faIdCard} />}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    /** @format */ classes={gridClasses}
                  >
                    <PhoneFormInput
                      onBlur={handleBlur}
                      errorMessage={getErrorMessage(
                        errors,
                        touched,
                        'phoneNumber',
                      )}
                      name="phoneNumber"
                      label="Phone Number"
                      id={generateId('field-phone-number')}
                      value={values.phoneNumber}
                      onChange={handleChange}
                      Adornment={PhoneEnabledOutlined}
                    />
                  </Grid>
                </Grid>
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
                  disabled={isSubmitting}
                  style={{ width: 86 }}
                  variant="contained"
                  color="primary"
                >
                  {isSubmitting ? <BaseLoader /> : isEdit ? 'UPDATE' : 'SAVE'}
                </Button>
              </DialogActions>
            </>
          )}
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
