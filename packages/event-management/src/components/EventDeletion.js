/** @format */

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from '@emotion/styled';
import { DELETE_EVENT } from '../graphql/events';
import { useMutation } from '@teamhub/apollo-config';
import { getOneSearchParam } from '../utils/url';
import { showToast } from '@teamhub/toast';
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
} from '@material-ui/core';
import strings from '../constants/strings';

const StyledButton = styled(Button)`
  &&&& {
    font-weight: bold;
    font-size: 16px;
  }
`;

function EventDeletion(props) {
  const isMobile = useMediaQuery('(max-width:960px)');
  const { isRecurring, event } = props;
  const [isOpen, setIsOpen] = useState(false);

  const [deleteEvent] = useMutation(DELETE_EVENT);

  const variables = {
    communityId: getOneSearchParam('communityId', '14'),
    force: true,
  };

  const history = useHistory();
  const {
    location: { search: searchParams },
  } = history;

  const headerText = isRecurring
    ? strings.Event.deletion.deleteSeries
    : strings.Event.deletion.deleteEvent;

  const deleteOnClick = () => {
    const scope = isRecurring ? 'forward' : 'single';
    deleteEvent({
      variables: {
        ...variables,
        scope,
        eventId: event.eventId,
        date: event.startsAt,
      },
    })
      .then(() => onSuccess(event.name))
      .catch((err) => onError(err));
  };

  const onSuccess = (name) => {
    showToast(strings.Event.deletion.deleteSuccess(name));
    setIsOpen(false);
    history.push(`/${searchParams}`);
  };

  const onError = (err) => {
    setIsOpen(false);
    console.warn(err);
  };

  return (
    <Grid container style={{ padding: '0 25px 25px 25px' }}>
      <StyledButton
        id={`EM_delete-${isRecurring ? 'series' : 'event'}-btn`}
        color="secondary"
        onClick={() => setIsOpen(true)}
      >
        {headerText}
      </StyledButton>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fullScreen={isMobile}
      >
        <DialogTitle>{headerText}</DialogTitle>
        <DialogContent dividers>
          <div>{strings.Event.deletion.willBeRemovedFromDashboard}</div>
          <div>{strings.Event.deletion.rsvpsWillBeRemoved}</div>
        </DialogContent>
        <DialogActions>
          <Button id="EM_delete-cancel" onClick={() => setIsOpen(false)}>
            {strings.Buttons.cancel}
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={deleteOnClick}
            style={{ marginLeft: 15 }}
            id="EM_delete-confirm"
          >
            {strings.Buttons.delete}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default EventDeletion;
