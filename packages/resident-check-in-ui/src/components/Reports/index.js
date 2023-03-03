import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import UnresolvedAlerts from './UnresolvedAlerts';
import TimeRangeReport from './TimeRangeReport';

export default function DownloadReports() {
  const [anchorEl, setAnchorEl] = useState(null);

  function handleOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpen}
      >
        Download Reports
        <ExpandMore />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem  style={{ padding: 0 }}>
          <UnresolvedAlerts onClose={handleClose} />
        </MenuItem>
        <MenuItem style={{ padding: 0 }}>
          <TimeRangeReport onClose={handleClose} />
        </MenuItem>
      </Menu>
    </>
  );
}
