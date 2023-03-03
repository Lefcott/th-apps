/** @format */

import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@teamhub/apollo-config';
import { clone, get, flatten } from 'lodash';
import { getOneSearchParam } from '../utils/url';
import { ActionButton } from './styleUtils';
import styled from '@emotion/styled';
import {
  GET_CALENDARS,
  PUBLISH_EVENTS_FOR_TIME_RANGE,
  GET_EVENTS,
} from '../graphql/events';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { showToast, showErrorToast } from '@teamhub/toast';
import Moment from 'moment-timezone';
import { extendMoment } from 'moment-range';
import DateSelector from './DateSelector';
import CalendarSelector from './DownloadEventsCalendarSelector';
import { expandEvent } from '../utils/recurrence';
import strings from '../constants/strings';

const moment = extendMoment(Moment);

const StyledButton = styled(Button)`
  &&&& {
    margin: 0 5px;
    padding: 5px 10px;

    @media (max-width: 950px) {
      font-size: 12px;
    }
  }
`;

const ModalContent = styled.div`
  padding-top: 1em;
  min-height: 3em;
  background-color: white;
  color: black;
`;

export default function PublishAllModal({
  modalOpen,
  setModalOpen,
  loadEvents,
}) {
  // initialize state
  const communityId = getOneSearchParam('communityId', '14');
  const [filters, setFilters] = useState({
    startDate: moment().startOf('day'),
    endDate: moment().add(7, 'days').endOf('day'),
    calendars: [],
  });
  const [eventCount, setEventCount] = useState(0);

  const [publishEvents] = useMutation(PUBLISH_EVENTS_FOR_TIME_RANGE);
  const [published, setPublished] = useState(false);
  const { data: filtersData } = useQuery(GET_CALENDARS, {
    variables: { communityId },
  });

  const {
    data: eventData,
    loading: eventsLoading,
    refetch,
  } = useQuery(GET_EVENTS, {
    variables: {
      communityId,
      limit: 2000,
      statuses: ['draft'],
      startDate: filters.startDate.toISOString(),
      endDate: filters.endDate.toISOString(),
      calendars: filters.calendars.map(({ _id }) => _id),
    },
    skip: !communityId,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });
  const events = get(eventData, 'community.getEvents.events', null);
  let entering = async () => {
    setPublished(false);
  };

  useEffect(() => {
    if (events) {
      const instances = flatten(
        events.map((event) =>
          expandEvent(
            event,
            filters.startDate.toISOString(),
            filters.endDate.toISOString(),
          ),
        ),
      ).filter((ev) => ev.publishStatus === 'Draft'); // only display drafted instances from the event;

      setEventCount(instances.length);
    }
  }, [events]);

  let exiting = async () => {
    if (published) {
      //doing this so updates are reflecting in calendar
      await loadEvents({
        context: { debounceKey: 'GET_EVENTS', debounceTimeout: 400 },
      });
    }
  };

  // setup change handler
  const changeHandler = (val, key) => {
    let filter = clone(filters);
    if (key === 'startDate' && val > filters.endDate) {
      const diffInDays = filter.endDate.diff(filters.startDate, 'days');
      const newEndDate = val.clone().add(diffInDays, 'days');
      filter.endDate = newEndDate;
    }

    filter[key] = val;
    setFilters(filter);
    refetch();
  };

  // handle publish
  const publish = async () => {
    let variables = {
      communityId,
      startDate: filters.startDate.toISOString(),
      endDate: filters.endDate.toISOString(),
      calendars: filters.calendars.map(({ _id }) => _id),
    };

    try {
      setPublished(true);
      await publishEvents({ variables });
      showToast(strings.Publish.eventsPublishedSuccess);
      await refetch();
      setModalOpen(false);
    } catch (err) {
      setPublished(false);
      showErrorToast();
    }
  };

  const getEventsToByPublishedText = () => {
    if (!events) return '';
    if (!events.length) return strings.Publish.noEventsAdded;
    if (!eventCount) return strings.Publish.allEventsPublished;
    if (eventCount === 1) return strings.Publish.oneEventWillBePublished;

    return strings.Publish.manyEventsWillBePublished(eventCount);
  };

  const eventsToBePublishedText = getEventsToByPublishedText();

  return (
    <>
      <StyledButton
        id="Em_calendar-publishAll"
        variant="contained"
        onClick={() => setModalOpen(true)}
      >
        {strings.Publish.publishEvents}
      </StyledButton>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onEnter={entering}
        onExit={exiting}
      >
        <DialogTitle
          style={{
            paddingBottom: 0,
          }}
        >
          <span style={{ top: '0.3em' }}>{strings.Publish.publishEvents}</span>
        </DialogTitle>
        <DialogContent style={{ paddingTop: '0.5rem' }}>
          <ModalContent
            style={{ paddingTop: 0, minHeight: '1em', color: 'grey' }}
          >
            {strings.Publish.selectDate}
          </ModalContent>
          <ModalContent
            style={{
              paddingTop: '2.5rem',
            }}
          >
            <DateSelector
              startDate={filters.startDate}
              endDate={filters.endDate}
              handler={changeHandler}
            />
          </ModalContent>
          <ModalContent
            style={{
              paddingTop: '0.5rem',
              maxWidth: '29rem',
            }}
          >
            <CalendarSelector
              variant="outlined"
              options={filtersData?.community.eventCalendars || []}
              value={filters.calendars}
              onChange={(val) => changeHandler(val, 'calendars')}
            />
          </ModalContent>
          <ModalContent style={{ marginTop: '0.5rem' }}>
            {eventsLoading ? (
              <CircularProgress />
            ) : (
              <span>{eventsToBePublishedText}</span>
            )}
          </ModalContent>
        </DialogContent>
        <DialogActions style={{ padding: '0.5rem 1rem' }}>
          <ActionButton
            style={{ padding: '0.25rem 0.5rem' }}
            variant="text"
            color="primary"
            onClick={() => setModalOpen(false)}
          >
            {strings.Buttons.cancel}
          </ActionButton>
          <ActionButton
            variant="text"
            size="large"
            color="primary"
            onClick={publish}
            style={{ padding: '0.25rem 0.5rem' }}
            disabled={!eventCount || eventsLoading || published}
          >
            {strings.Buttons.publish}
          </ActionButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
