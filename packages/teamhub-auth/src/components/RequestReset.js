/** @format */

import React from 'react';
import { Formik } from 'formik';
import {
  Box,
  TextField,
  Button,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { sendPasswordResetEmail } from '../utils/authentication';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';

const resetSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').min(1).required(),
});

export default function RequestReset(props) {
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:960px)');
  const goToLogin = () => history.push('/');
  const submitPasswordResetRequest = async (values, actions) => {
    try {
      const res = await sendPasswordResetEmail(values.email);
      if (res === 'not found') {
        actions.setFieldError(
          'email',
          'The email you entered is not in our system. Please enter a valid email address.',
        );
        actions.setSubmitting(false);
      } else if (res === 'success') {
        setHasSubmitted('success');
        actions.setSubmitting(false);
      }
    } catch (err) {
      setHasSubmitted('error');
      actions.setSubmitting(false);
    }
  };

  const tokenError = history?.location?.state?.tokenInvalid;

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={resetSchema}
      onSubmit={submitPasswordResetRequest}
    >
      {({ values, errors, ...props }) => {
        return (
          <form
            style={{
              flexGrow: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            onSubmit={!hasSubmitted ? props.handleSubmit : goToLogin}
            data-testid="TA_forgot-password_form"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              flexGrow={isMobile ? 0 : 1}
              height={isMobile ? 'auto' : '100%'}
              justifyContent="space-between"
              width="100%"
            >
              <Box width="100%">
                {tokenError && !hasSubmitted && (
                  <Typography variant="body1" color="error">
                    {tokenError}
                  </Typography>
                )}

                <Typography
                  variant="body1"
                  style={{ marginBottom: '16px', color: 'rgba(0, 0, 0, 0.6)' }}
                >
                  {!hasSubmitted
                    ? 'Please enter your email address.You will be sent a link to reset your password. This link will expire in 15 minutes.'
                    : 'An email with instructions on how to reset your password has been sent to:'}
                </Typography>
                {!hasSubmitted ? (
                  <TextField
                    disabled={Boolean(hasSubmitted)}
                    name="email"
                    label="Email"
                    id="TA_forgot-password_email-input"
                    value={values.email}
                    variant="outlined"
                    fullWidth
                    onBlur={props.onBlur}
                    error={!!errors.email}
                    helperText={errors.email}
                    onChange={props.handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    style={{
                      marginBottom: '16px',
                      color: 'rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    {values.email}
                  </Typography>
                )}

                {hasSubmitted && (
                  <Typography
                    variant="body1"
                    style={{
                      marginBottom: '16px',
                      color: 'rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    This link will expire in 15 minutes
                  </Typography>
                )}
              </Box>

              <Box
                width="100%"
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                mt={isMobile && 3}
              >
                <Button
                  color="primary"
                  type="submit"
                  variant="contained"
                  id={
                    hasSubmitted
                      ? 'TA_forgot-password-go-to-login'
                      : 'TA_forgot-password-send-email'
                  }
                  disabled={!values.email}
                >
                  {hasSubmitted ? 'Log In' : 'Send Email'}
                </Button>
              </Box>
            </Box>
          </form>
        );
      }}
    </Formik>
  );
}
