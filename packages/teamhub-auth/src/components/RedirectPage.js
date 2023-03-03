/** @format */

import React, {useEffect} from 'react';
import { Formik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { useCurrentUser, navigate } from '@teamhub/api';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  useMediaQuery,
} from '@material-ui/core';

export default function RedirectPage(props) {
  const isMobile = useMediaQuery('(max-width:960px)');
  const [submitError, setSubmitError] = React.useState('');
  const [referrer, setReferrer] = React.useState(document.referrer);
  const [me, loading, err] = useCurrentUser();

  console.log(me)
  
  useEffect(() => {
    if(referrer == 'https://k4connect.customerhubs.com/') {
      setSubmitError(
        <>
          <span>We are unable to associate your K4Connect account with EverAfter. Please click </span>
          <a href = {"mailto:support@k4connect.com?subject=Everafter&body=Hello, I am having trouble accessing the EverAfter integration in the TeamHub. Could you plese help me? My email address is: " + me?.email}>
          here
          </a>
          <span> to send a help request to K4Connect support.</span>
        </>
      )
    }
  }, [referrer, me])
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="100%"
      width="100%"
    >
      <Box width="100%" flexGrow={isMobile ? 0 : 1}>
        <Typography data-testid="TA_login-form_error" color="error">
          {submitError}
        </Typography>
      </Box>
    </Box>
  );
}
