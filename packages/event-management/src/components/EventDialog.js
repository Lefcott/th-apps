/** @format */

import React, { useState, useContext } from 'react';
import { useMutation } from '@teamhub/apollo-config';
import { showToast, showErrorToast } from '@teamhub/toast';
import { sendPendoEvent } from '@teamhub/api';
import State from './StateProvider';
import { isNull, isEqual, isEmpty } from 'lodash';
import moment from 'moment-timezone';
import { useHistory } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  useMediaQuery,
} from '@material-ui/core';
import styled from '@emotion/styled';
import strings from '../constants/strings';
import { DELETE_EVENT, UPDATE_EVENT } from '../graphql/events';
import { getOneSearchParam } from '../utils/url';

const WarningText = styled.span`
  font-size: 15.5px;
  color: #00000099;
  margin-left: 33px;
`;

function EventDialog(props) {
  const isMobile = useMediaQuery('(max-width:960px)');
  const {
    event,
    isOpen,
    setIsOpen,
    onClose,
    action,
    removeEvent,
    changeEventPublishStatus,
  } = props;
  const [value, setValue] = useState(null);
  const isRecurringSelected = value === 'recurring';
  const [deleteEvent, { loading: deleteLoading }] = useMutation(DELETE_EVENT);
  const [updateEvent, { loading: updateLoading }] = useMutation(UPDATE_EVENT);
  const loading = deleteLoading || updateLoading;
  const Context = useContext(State);
  const { filters } = Context;
  const variables = {
    communityId: getOneSearchParam('communityId', '14'),
    force: true,
  };

  const history = useHistory();
  const {
    location: { search: searchParams },
  } = history;

  const handleSubmit = () => {
    const scope = isRecurringSelected ? 'forward' : 'single';

    switch (action) {
      case 'edit': {
        Context.setRecurring(isEqual(value, 'recurring'));
        history.push(
          `/${event.eventId}/date/${moment(
            event.startsAt,
          ).toISOString()}${searchParams}`,
        );
        break;
      }
      case 'delete': {
        deleteEvent({
          variables: {
            ...variables,
            scope,
            eventId: event.eventId,
            date: event.startsAt,
          },
        })
          .then(() => onDeleteSuccess(event.name))
          .catch(() => showErrorToast());
        break;
      }
      case 'archive': {
        updateEvent({
          variables: {
            ...variables,
            scope,
            eventId: event.eventId,
            date: event.startsAt,
            updates: {
              status: 'Archived',
              location: event.eventLocation?._id,
            },
          },
        })
          .then(() => onArchiveSuccess(event.name))
          .catch(() => showErrorToast());
        break;
      }
    }
  };

  const onDeleteSuccess = (name) => {
    showToast(strings.Event.deletion.deleteSuccess(name));
    setIsOpen(false);
    removeEvent(event, isRecurringSelected ? event.startsAt : null);

    if (isRecurringSelected) {
      sendPendoEvent('event_series_delete');
    } else {
      sendPendoEvent('event_single_delete');
    }
  };

  const onArchiveSuccess = (name) => {
    showToast(strings.Event.archiving.archiveSuccess(name));
    setIsOpen(false);

    // Remove the event from the list if it's not selected in the statuses filter
    if (!isEmpty(filters.statuses) && !filters.statuses.includes('archived')) {
      removeEvent(event, isRecurringSelected ? event.startsAt : null);
    } else {
      changeEventPublishStatus(
        event,
        isRecurringSelected ? event.startsAt : null,
        'Archived',
      );
    }

    if (isRecurringSelected) {
      sendPendoEvent('event_series_archive');
    } else {
      sendPendoEvent('event_single_archive');
    }
  };

  const handleClose = () => {
    setValue(null);
    onClose();

    if (action === 'delete') {
      sendPendoEvent('event_cancel_delete');
    } else if (action === 'archive') {
      sendPendoEvent('event_cancel_archive');
    }
  };

  return (
    <Dialog
      id="Em_eventEditModal"
      open={isOpen}
      onClose={handleClose}
      fullScreen={isMobile}
    >
      <DialogTitle>
        {action === 'delete'
          ? strings.Event.deletionModal.deleteEvent
          : action === 'edit'
          ? strings.Event.edition.editEvent
          : action === 'archive'
          ? strings.Event.archiving.archiveEvent
          : ''}
      </DialogTitle>
      <DialogContent dividers={event?.recurring} style={{ minWidth: 400 }}>
        {event?.recurring ? (
          <RadioGroup value={value} onChange={(e) => setValue(e.target.value)}>
            <FormControlLabel
              value="single"
              control={
                <Radio color="primary" id="Em_eventEditModal-singleEvent" />
              }
              label={strings.Event.edition.thisEvent}
            />
            {value === 'single' && (
              <WarningText>
                {action === 'delete'
                  ? strings.Event.deletionModal.thisEventWarning
                  : action === 'archive'
                  ? strings.Event.archiving.thisEventWarning
                  : ''}
              </WarningText>
            )}
            <FormControlLabel
              value="recurring"
              control={
                <Radio color="primary" id="Em_eventEditModal-recurringEvent" />
              }
              label={strings.Event.edition.thisAndFollowingEvents}
            />
            {isRecurringSelected && (
              <WarningText>
                {action === 'delete'
                  ? strings.Event.deletionModal.thisAndFollowingEventsWarning
                  : action === 'archive'
                  ? strings.Event.archiving.thisAndFollowingEventsWarning
                  : ''}
              </WarningText>
            )}
          </RadioGroup>
        ) : action === 'delete' ? (
          strings.Event.deletionModal.thisEventWarning
        ) : action === 'archive' ? (
          strings.Event.archiving.thisEventWarning
        ) : (
          ''
        )}
      </DialogContent>
      <DialogActions>
        <Button id="Em_eventEditModal-cancel" onClick={handleClose}>
          {strings.Buttons.cancel}
        </Button>
        <Button
          id="Em_eventEditModal-ok"
          color={action === 'edit' ? 'primary' : 'secondary'}
          variant="text"
          disabled={(event?.recurring && isNull(value)) || loading}
          onClick={handleSubmit}
          style={{ padding: '5px 25px', marginLeft: 15 }}
        >
          {action === 'delete'
            ? strings.Buttons.delete
            : action === 'archive'
            ? strings.Buttons.archive
            : strings.Buttons.ok}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EventDialog;
