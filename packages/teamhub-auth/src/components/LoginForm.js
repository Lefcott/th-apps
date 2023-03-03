/** @format */

import React from 'react';
import { Formik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { useCurrentUser, navigate } from '@teamhub/api';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { login } from '../utils/authentication';
import * as yup from 'yup';

const loginSchema = yup.object().shape({
  email: yup.string().email().min(1).required(),
  password: yup.string().min(1).required(),
});

const useStyles = makeStyles(() => ({
  paddedBottom: {
    paddingBottom: '56px',
  },
}));

const unauthenticatedError =
  'Your username and/or password were incorrect. Please try again or click "Forgot Password" to reset your password.';

export default function LoginForm(props) {
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:960px)');
  const [submitError, setSubmitError] = React.useState('');
  const classes = useStyles();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="100%"
      width="100%"
    >
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={loginSchema}
        onSubmit={async (values, actions) => {
          // auth route
          const user = await login(values.email, values.password);
          if (user === 'unauthorized') {
            actions.setSubmitting(false);
            return setSubmitError(unauthenticatedError);
          } else {
            actions.setSubmitting(false);
            return history.push('/community');
          }
        }}
      >
        {({ values, errors, touched, ...props }) => (
          <form
            onSubmit={props.handleSubmit}
            data-testid="TA_login-form"
            style={{
              flexGrow: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <Box width="100%">
              <TextField
                value={values.email}
                name="email"
                label="Email"
                fullWidth
                variant="outlined"
                id="TA_login-form_username-input"
                InputLabelProps={{
                  shrink: true,
                }}
                className={classes.paddedBottom}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                onChange={props.handleChange}
              />
              <TextField
                value={values.password}
                name="password"
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                id="TA_login-form_password-input"
                InputLabelProps={{
                  shrink: true,
                }}
                className={classes.paddedBottom}
                style={{ paddingBottom: '24px' }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                onChange={props.handleChange}
              />
            </Box>
            <Box width="100%" flexGrow={isMobile ? 0 : 1}>
              <Typography data-testid="TA_login-form_error" color="error">
                {submitError}
              </Typography>
            </Box>
            <Box
              width="100%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Button
                style={{ marginRight: '8px' }}
                onClick={() => history.push('/request-reset')}
                data-testid="TA_login-form_reset-password"
                id="TA_login-form_reset-password"
              >
                Forgot Password?
              </Button>
              <Button
                color="primary"
                type="submit"
                variant="contained"
                disabled={props.isSubmitting}
                data-testid="TA_login-form_submit"
                id="TA_login-form_submit"
              >
                Login
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}
