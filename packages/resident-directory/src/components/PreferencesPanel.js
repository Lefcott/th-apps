/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import { Settings } from '@material-ui/icons';
import { Typography, Grid, Switch } from '@material-ui/core';
import {
  StyledExpansionPanel,
  Sublabel,
  Switchlabel,
} from '../utils/styledComponents';
import PanelHeader from './PanelHeader';
import { useQuery } from '@teamhub/apollo-config';
import { GET_DIRECTORY_OPT_OUT_ENABLED } from '../graphql/community';
import strings from '../constants/strings';
import { IntegrationsContext } from '../contexts/IntegrationsProvider';

function PreferencesPanel(props) {
  const { readOnly, expanded, activatePanel, resident, me, communityId } =
    props;
  const {
    loading: communitySettingsLoading,
    error: communitySettingsError,
    data: communitySettingsData,
  } = useQuery(GET_DIRECTORY_OPT_OUT_ENABLED, {
    variables: { communityId },
  });

  const { integrations } = React.useContext(IntegrationsContext);
  const { rciOptOutDisabled = false, directoryOptOutDisabled = false } =
    integrations;

  let communitySettings = {};
  if (!communitySettingsLoading && communitySettingsData) {
    communitySettings = communitySettingsData?.community?.settings;
  }

  return (
    <StyledExpansionPanel
      id="Rm_Panel-preferences"
      expanded={expanded}
      onChange={activatePanel}
      summary={
        <PanelHeader
          icon={Settings}
          label={strings.InfoPanel.preferencesHeader}
        />
      }
      details={
        <Grid container alignItems="center">
          <Grid spacing={2} container>
            {me && me.roles && me.roles.includes('Check-in') && (
              <>
                <Grid item xs={8} sm={10} md={8}>
                  <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {strings.InfoPanel.checkInAlerts}
                  </Typography>
                  <Sublabel>
                    Check-In alerts are{' '}
                    {resident.checkin === false && (
                      <strong>
                        <em>not</em>
                      </strong>
                    )}{' '}
                    active on this resident.
                  </Sublabel>
                </Grid>
                <Grid item xs={4} sm={2} md={4} style={{ marginTop: 16 }}>
                  <Switchlabel>Off</Switchlabel>
                  <Switch
                    color="primary"
                    name="checkin"
                    id="Rm_preferencesPanel-checkinToggle"
                    disabled={readOnly || rciOptOutDisabled}
                    onChange={props.handleChange}
                    checked={resident.checkin}
                  />
                  <Switchlabel>On</Switchlabel>
                </Grid>
              </>
            )}
            <br></br>
            {!communitySettingsLoading &&
              communitySettings &&
              communitySettings.directoryOptOutEnabled && (
                <>
                  <Grid item xs={8} sm={10} md={8}>
                    <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
                      Visibility
                    </Typography>
                    <Sublabel>{strings.InfoPanel.visibility}</Sublabel>
                  </Grid>
                  <Grid item xs={4} sm={2} md={4}>
                    <Switchlabel>Off</Switchlabel>
                    <Switch
                      color="primary"
                      checked={resident['optOutOfDirectory']}
                      disabled={readOnly || directoryOptOutDisabled}
                      onChange={props.handleChange}
                      name="optOutOfDirectory"
                    />
                    <Switchlabel>On</Switchlabel>
                  </Grid>
                </>
              )}
          </Grid>
        </Grid>
      }
    />
  );
}

PreferencesPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  activatePanel: PropTypes.func.isRequired,
  resident: PropTypes.object.isRequired,
};

PreferencesPanel.defaultProps = {
  resident: {},
};

export default PreferencesPanel;
