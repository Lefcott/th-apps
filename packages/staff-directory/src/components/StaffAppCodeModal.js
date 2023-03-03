/** @format */

import React from 'react';
import { getCommunityId, sendPendoEvent } from '@teamhub/api';
import { useMutation } from '@teamhub/apollo-config';
import { get } from 'lodash';
import styled from '@emotion/styled';
import { Launch as LaunchIcon } from '@material-ui/icons';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Link,
  useMediaQuery,
  Typography,
} from '@material-ui/core';
import { GET_INVITE_CODE } from '../graphql/support';
import { UPDATE_STAFF_MEMBER } from '../graphql/users';

const ActionButton = styled(Button)`
  && {
    font-weight: bold;
    padding: 8px 15px;
  }
`;

function StaffAppCodeModal({ open, onConfirm, staff }) {
  const isMobile = useMediaQuery('(max-width:960px)');
  const [generateAppCode, { data, error }] = useMutation(GET_INVITE_CODE);
  const code = get(data, 'community.user.inviteUserWithCode.inviteCode', '');
  React.useEffect(() => {
    if (open && staff) {
      generateAppCode({
        skip: !staff,
        variables: {
          communityId: getCommunityId(),
          userId: staff?._id,
        },
      });
    }
  }, [open, staff, generateAppCode]);

  React.useEffect(() => {
    sendPendoEvent('staff_requestcode', staff);
  }, [staff]);

  return (
    <Dialog open={open} onClose={onConfirm} fullScreen={isMobile}>
      <DialogTitle variant="h6">App Activation Code</DialogTitle>
      <DialogContent style={{ maxWidth: 375 }}>
        <DialogContentText>
          {`After ${staff?.firstName} has downloaded the K4 Community app they will need to enter this code to activate their app.`}
        </DialogContentText>

        <DialogContentText>
          Need help? Go to the{' '}
          <Link
            target="_blank"
            style={{ display: 'inline-flex', alignItems: 'center' }}
            color="inherit"
            underline="always"
            href="https://support.k4connect.com/?post_type=manual_kb&p=3640&preview=true"
          >
            support page
            <LaunchIcon style={{ paddingLeft: '4px', fontSize: 'inherit' }} />
          </Link>
        </DialogContentText>

        <Typography align="center" variant="h2">
          {code}
        </Typography>
        <Typography align="center" variant="h5">
          {`${staff?.firstName}'s Activation Code`}
        </Typography>
        <Typography align="center" variant="body1">
          This code is good for 72 hours
        </Typography>
      </DialogContent>
      <DialogActions>
        <ActionButton color="primary" onClick={onConfirm}>
          Done
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
}

export default StaffAppCodeModal;
