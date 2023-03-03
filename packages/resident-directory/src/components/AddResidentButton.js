/** @format */

import React from 'react';
import { Fab, Hidden, Button } from '@material-ui/core';
import { ReactActionAreaPortal } from '@teamhub/api';
import strings from '../constants/strings';
import { IntegrationsContext } from '../contexts/IntegrationsProvider';

export default function AddResidentButton({
  addResident,
  activeId,
  classes,
  ...props
}) {
  const { integrations } = React.useContext(IntegrationsContext);
  const { residentIntegrationEnabled = false } = integrations;

  if (residentIntegrationEnabled) return <></>;

  return (
    <>
      <Hidden mdUp>
        {!activeId && (
          <Fab color="primary" onClick={addResident} className={classes.fab}>
            {strings.Resident.add}
          </Fab>
        )}
      </Hidden>
      <Hidden smDown>
        <ReactActionAreaPortal>
          <Button
            onClick={addResident}
            variant="contained"
            color="primary"
            id="Rm_Create-resident"
          >
            {strings.Resident.add}
          </Button>
        </ReactActionAreaPortal>
      </Hidden>
    </>
  );
}
