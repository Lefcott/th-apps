/** @format */

import React from 'react';
import { Box } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withStyles, makeStyles } from '@material-ui/styles';
import { faSyncAlt } from '@fortawesome/pro-light-svg-icons';
import { IntegrationsContext } from '../contexts/IntegrationsProvider';

import strings from '../constants/strings';

const IntegrationAlert = withStyles({
  root: {
    color: '#000',
    backgroundColor: '#FFE7A1',
    fontWeight: '500',
    fontSize: '14px',
  },
  icon: {
    color: '#000000 !important',
  },
})(Alert);

const useBoxStyles = makeStyles(() => ({
  root: {
    marginBottom: '20px',
  },
}));

export default function IntegrationsWarning() {
  const { integrations } = React.useContext(IntegrationsContext);
  const {
    residentIntegrationEnabled = false,
    familyIntegrationEnabled = false,
  } = integrations;

  const boxStyles = useBoxStyles();

  const messaging = strings.Integrations;

  const getMessage = () => {
    if (residentIntegrationEnabled && familyIntegrationEnabled) {
      return messaging.multipleIntegrations;
    } else if (residentIntegrationEnabled) {
      return messaging.resident;
    } else if (familyIntegrationEnabled) {
      return messaging.friendsAndFamily;
    }
    return null;
  };

  const message = getMessage();

  return (
    <>
      {message && (
        <Box classes={boxStyles}>
          <IntegrationAlert
            icon={<FontAwesomeIcon icon={faSyncAlt} />}
            severity="warning"
          >
            {' '}
            {message}
          </IntegrationAlert>
        </Box>
      )}
    </>
  );
}
