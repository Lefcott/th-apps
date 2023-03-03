/** @format */

import React from 'react';
import { Box, Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { DateTime } from 'luxon';

import { withStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faSyncAlt } from '@fortawesome/pro-light-svg-icons';
import { get } from 'lodash';

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

const IntegrationSupportButton = withStyles({
  root: {
    color: '#000',
    backgroundColor: '#FFE7A1',
    height: 20,
    fontSize: '12px',
  },
})(Button);

const getFutureSyncTime = (lastUpdatedIntegrationTime) => {
  const HOUR = 60;

  if (!lastUpdatedIntegrationTime) {
    return '';
  }

  try {
    return (
      HOUR +
      parseInt(
        get(
          DateTime.fromISO(lastUpdatedIntegrationTime).diffNow('minutes'),
          'values.minutes'
        )
      )
    );
  } catch (e) {
    console.log('could not parse time diff');
    return '';
  }
};

export default function IntegrationAlerts({ lastUpdatedIntegrationTime }) {
  const openExternalLink = () =>
    window.open(
      'https://support.k4connect.com/knowledgebase/grove-integration/',
      '_blank'
    );

  return (
    <Box style={{ position: 'absolute', top: '8px', zIndex: 1300 }}>
      <IntegrationAlert
        icon={<FontAwesomeIcon icon={faSyncAlt} />}
        severity="warning"
      >
        {' '}
        Dining Integration Enabled: Dining is Read-Only
        <span style={{ fontWeight: 'normal', marginRight: 100 }}>
          &nbsp; Last Sync :{' '}
          {lastUpdatedIntegrationTime &&
            DateTime.fromISO(lastUpdatedIntegrationTime).toRelative()}
          , next sync in {getFutureSyncTime(lastUpdatedIntegrationTime)}{' '}
          minutes.
        </span>
        <IntegrationSupportButton
          onClick={openExternalLink}
          display="flex"
          endIcon={<FontAwesomeIcon icon={faExternalLinkAlt}></FontAwesomeIcon>}
        >
          View Support Article
        </IntegrationSupportButton>
      </IntegrationAlert>
    </Box>
  );
}
