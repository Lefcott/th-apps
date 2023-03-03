/** @format */

import React from 'react';
import { Box } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { withStyles, makeStyles } from '@material-ui/styles';
import { Sync } from '@material-ui/icons';
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

const useBoxStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '20px',
  },
}));

export default function IntegrationsWarning() {
  const { integrations } = React.useContext(IntegrationsContext);
  const { staffIntegrationEnabled = false } = integrations;

  const boxStyles = useBoxStyles();

  return (
    <>
      {staffIntegrationEnabled && (
        <Box classes={boxStyles}>
          <IntegrationAlert icon={<Sync />} severity="warning">
            {' '}
            {strings.staffIntegrationEnabled}
          </IntegrationAlert>
        </Box>
      )}
    </>
  );
}
