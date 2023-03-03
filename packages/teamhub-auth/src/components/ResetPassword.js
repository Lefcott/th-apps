/** @format */

import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Visibility,
  VisibilityOff,
  CheckCircleOutline,
} from '@material-ui/icons';
import escapeRegExp from 'lodash.escaperegexp';
import { Formik } from 'formik';
import {
  Typography,
  Box,
  Popover,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { resetPassword, validateToken } from '../utils/authentication';
import * as yup from 'yup';

const useStyles = makeStyles(() => ({
  paddingBottom: {
    paddingBottom: '24px',
  },
  arrowDiv: {
    position: 'absolute',
    fontSize: '7px',
    width: '3em',
    height: '3em',
    '&:before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  },
}));

const newPasswordSchema = yup.object({
  password: yup
    .string()
    .test(
      'password',
      'Your password must have 1 letter, 1 uppercase value, and be at least 7 characters long',
      (value, ctx) => {
        const escapedValue = escapeRegExp(value);
        return escapedValue.match(/((?=.*\d)(?=.*[A-Z]).{7,})/g);
      },
    )
    .min(1)
    .required(
      'Your password must have 1 letter, 1 uppercase value, and be at least 7 characters long',
    ),
  confirmPassword: yup
    .string()
    .test('passwords-match', 'Passwords do not match', function (value) {
      return this.parent.password === value;
    }),
});

export default function ResetPassword(props) {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:960px)');
  const history = useHistory();
  const classes = useStyles();
  const [showPassword, setShowPassword] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  function parseTokenFromSearch() {
    const parsedSearchParams = new URLSearchParams(location.search);
    const token = parsedSearchParams.get('token');
    return token;
  }

  async function handleSubmit(values, actions) {
    try {
      // send password reset w/ token
      const res = await resetPassword(parseTokenFromSearch(), values.password);
      if (res === 'success') {
        actions.setSubmitting(false);
        setHasSubmitted(true);
      } else if (res === 'invalidToken') {
        // token expired during the form fillout
        // prob pop a toast or redirect
        actions.setSubmitting(false);
      } else {
        actions.setSubmitting(false);
      }

      actions.setSubmitting(false);
    } catch (err) {
      console.debug(err);
      actions.setSubmitting(false);
    }
  }

  React.useEffect(() => {
    const token = parseTokenFromSearch();
    if (!token) {
      history.push('/request-reset');
    } else {
      validateToken(token).then((res) => {
        if (res !== 'validToken') {
          history.push('/request-reset', {
            tokenInvalid: 'This link has expired',
          });
        }
      });
    }
    // eslint-disable-next-line
  }, []);

  if (hasSubmitted) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
        width="100%"
      >
        <Typography>Your password has been successfully changed</Typography>

        <Box
          width="100%"
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Button
            variant="contained"
            color="primary"
            id="TA_reset-password_back-to-login-after-submit"
            onClick={() => history.push('/')}
          >
            Log In
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Formik
      initialValues={{
        password: '',
        confirmPassword: '',
      }}
      validateOnBlur={true}
      validateOnChange={false}
      validationSchema={newPasswordSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, ...props }) => (
        <form
          style={{
            flexGrow: 1,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
          onSubmit={props.handleSubmit}
          data-testid="TA_reset-password_form"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent={isMobile ? 'flex-start' : 'space-between'}
            height="100%"
            width="100%"
          >
            <Box width="100%">
              <Typography
                variant="body2"
                style={{ marginBottom: '16px', fontSize: '16px' }}
              >
                Please create a new password that you can use to log in with
                next time.
              </Typography>
              <TextField
                className={classes.paddingBottom}
                type={showPassword ? 'text' : 'password'}
                name="password"
                label="Password"
                id="TA_new-password-input"
                value={values.password}
                variant="outlined"
                fullWidth
                error={!!errors.password}
                helperText={errors.password}
                onFocus={(e) => setAnchorEl(e.currentTarget)}
                onBlur={(e) => {
                  setAnchorEl(null);
                  props.handleBlur(e);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        id="TA_new-password-toggle-visibility"
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={props.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <ValidationPopover
                anchorEl={anchorEl}
                password={values.password}
              />
              <TextField
                className={classes.paddingBottom}
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                id="TA_confirm-password-input"
                value={values.confirmPassword}
                variant="outlined"
                fullWidth
                error={
                  touched.password &&
                  touched.confirmPassword &&
                  !errors.password &&
                  errors.confirmPassword
                }
                helperText={
                  touched.password &&
                  touched.confirmPassword &&
                  !errors.password &&
                  errors.confirmPassword
                }
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            <Box
              width="100%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Button
                onClick={() => history.push('/')}
                id="TA_reset-password_back-to-login"
              >
                Back to Login
              </Button>
              <Button
                disabled={props.isSubmitting}
                color="primary"
                type="submit"
                id="TA_reset-password-save"
                variant="contained"
              >
                Save
              </Button>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );
}

const CheckIcon = (props) => (
  <CheckCircleOutline
    style={{
      color: 'rgba(0, 200, 83, 1)',
      fontSize: '14px',
      paddingRight: '4px',
    }}
  />
);

const TextContainer = (props) => (
  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
    {props.children}
  </span>
);

function ValidationPopover({ password, anchorEl, ...props }) {
  const uppercaseCheck = password.match(/(?=.*[A-Z])/g);
  const lengthCheck = password.length >= 7;
  const numberCheck = password.match(/(?=.*\d)/g);
  const lowercaseCheck = password.match(/(?=.*[a-z])/g);
  const isMobile = useMediaQuery('(max-width: 960px)');

  const anchorOrigin = isMobile
    ? {
        vertical: 'top',
        horizontal: 'center',
      }
    : {
        vertical: 'center',
        horizontal: 'right',
      };
  const transformOrigin = isMobile
    ? {
        vertical: 'bottom',
        horizontal: 'center',
      }
    : {
        vertical: 'center',
        horizontal: 'left',
      };

  if (anchorEl) {
    return (
      <Popover
        disableAutoFocus
        PaperProps={{
          style: {
            left: '50%',
            padding: '20px 22px',
            transform: isMobile ? 'none' : 'translateX(82px)',
          },
        }}
        disableEnforceFocus
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        data-testid="TA_reset-password-validator"
        anchorOrigin={anchorOrigin}
        disableRestoreFocus
        transformOrigin={transformOrigin}
      >
        <Typography variant="body2">Password must contain:</Typography>
        <br />
        <Typography variant="body2">
          <TextContainer>
            {uppercaseCheck && <CheckIcon />} an uppercase letter
          </TextContainer>
        </Typography>
        <Typography variant="body2">
          <TextContainer>
            {lowercaseCheck && <CheckIcon />} a lowercase letter
          </TextContainer>
        </Typography>
        <Typography variant="body2">
          <TextContainer>{numberCheck && <CheckIcon />} a number</TextContainer>
        </Typography>
        <Typography variant="body2">
          <TextContainer>
            {lengthCheck && <CheckIcon />} a minimum of 7 characters
          </TextContainer>
        </Typography>
      </Popover>
    );
  }
  return null;
}
