/** @format */

import React from 'react';
import { Fab, Hidden, Button } from '@material-ui/core';
import { ReactActionAreaPortal, sendPendoEvent } from '@teamhub/api';
import ManageGroupsDrawer from './ManageGroupsDrawer';
import strings from '../constants/strings';

export const ViewState = {
  LIST: 'ManageGroupsList',
  FORM_ADD: 'FormAdd',
  FORM_EDIT: 'FormEdit',
};

export default function ManageGroupsButton({
  activeId,
  classes,
  setResidentGroupDeleted,
}) {
  const [openMenuItemDrawer, setOpenMenuItemDrawer] = React.useState(false);

  function manageGroups() {
    sendPendoEvent(strings.PendoEvents.groups.groupsOpen);
    setOpenMenuItemDrawer(!openMenuItemDrawer);
  }

  return (
    <>
      <Hidden mdUp>
        {!activeId && (
          <Fab
            color="primary"
            onClick={manageGroups}
            className={classes.manageGroupsFab}
          >
            {strings.Card.button.manageGroups}
          </Fab>
        )}
      </Hidden>
      <Hidden smDown>
        <ReactActionAreaPortal>
          <Button
            onClick={manageGroups}
            color="primary"
            id="Rm_Manage-Groups"
            style={{ margin: '0rem 0.313rem' }}
          >
            {strings.Card.button.manageGroups}
          </Button>
        </ReactActionAreaPortal>
      </Hidden>

      <ManageGroupsDrawer
        open={openMenuItemDrawer}
        onClose={() => setOpenMenuItemDrawer(false)}
        setResidentGroupDeleted={setResidentGroupDeleted}
      />
    </>
  );
}
