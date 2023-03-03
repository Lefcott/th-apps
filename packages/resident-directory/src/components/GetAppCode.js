/** @format */

import React from 'react';
import { useMutation } from '@teamhub/apollo-config';
import { get } from 'lodash';
import PropTypes from 'prop-types';
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
import strings from '../constants/strings';

const ActionButton = styled(Button)`
  && {
    font-weight: bold;
    padding: 8px 15px;
  }
`;

function GetAppCode({
  open,
  close,
  communityId,
  residentId,
  residentFirstName,
}) {
  const isMobile = useMediaQuery('(max-width:960px)');
  const [generateAppCode, { data, error }] = useMutation(GET_INVITE_CODE);
  const code = get(data, 'community.user.inviteUserWithCode.inviteCode', '');
  React.useEffect(() => {
    if (open) {
      generateAppCode({
        variables: {
          communityId,
          userId: residentId,
        },
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={close} fullScreen={isMobile}>
      <DialogTitle variant="h6">{strings.Form.dialog.appCodeTitle}</DialogTitle>
      <DialogContent style={{ maxWidth: 375 }}>
        <DialogContentText>
          {strings.Form.dialog.appCodeText(residentFirstName)}
        </DialogContentText>

        <DialogContentText>
          {strings.FriendsAndFamily.needHelp}
          <Link
            target="_blank"
            style={{ display: 'inline-flex', alignItems: 'center' }}
            color="inherit"
            underline="always"
            href="https://support.k4connect.com/?post_type=manual_kb&p=3640&preview=true"
          >
            {strings.FriendsAndFamily.supportLink}
            <LaunchIcon style={{ paddingLeft: '4px', fontSize: 'inherit' }} />
          </Link>
        </DialogContentText>

        <Typography align="center" variant="h2">
          {code}
        </Typography>
        <Typography align="center" variant="h5">
          {strings.FriendsAndFamily.activationCode(residentFirstName)}
        </Typography>
        <Typography align="center" variant="body1">
          {strings.FriendsAndFamily.duration}
        </Typography>
      </DialogContent>
      <DialogActions>
        <ActionButton color="primary" onClick={() => close()}>
          {strings.Card.button.done}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
}

GetAppCode.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default GetAppCode;
