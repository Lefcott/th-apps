/** @format */

import React, { useState } from 'react';
import { useParams, useHistory, Route, useRouteMatch } from 'react-router-dom';
import { get, isEqual } from 'lodash';
import styled from '@emotion/styled';
import { sendPendoEvent } from '@teamhub/api';
import State from '../components/StateProvider';
import { Hidden, Box, Typography } from '@material-ui/core';
import EventDrawer from '../components/EventDrawer';
import EventInfo from '../components/EventInfo/EventInfo';
import Signups from '../components/Signups';
import { useQuery } from '@teamhub/apollo-config';
import { GET_EVENT } from '../graphql/events';
import { getOneSearchParam } from '../utils/url';
import { isSignupsEndPast } from '../utils/events';
import EventAppBar from '../components/EventAppBar';
import Loader from '../components/Loader';
import AttendanceTracking from '../components/AttendanceTracking';
import moment from 'moment-timezone';

const ViewWrapper = styled.div`
  display: flex;
  height: calc(100vh - 4rem);
  @media (max-width: 960px) {
    flex-flow: column;
  }
`;

function Event() {
  const [selectedDrawer, setSelectedDrawer] = useState('Event Info');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const Context = React.useContext(State);
  const { id, date } = useParams();
  const match = useRouteMatch();
  const { location } = useHistory();
  const eventRef = React.useRef();

  const isNewEvent = isEqual(id, 'new');
  const { errors, loading, data, refetch } = useQuery(GET_EVENT, {
    variables: {
      eventId: id,
      date: date,
      communityId: getOneSearchParam('communityId', '14'),
    },
    fetchPolicy: 'no-cache',
    skip: isNewEvent || !id,
  });

  const eodYesterday = moment().subtract(1, 'day').endOf('day');
  eventRef.current = get(data, 'community.getEvent');
  let isPastEditEvent =
    !isNewEvent &&
    eventRef?.current?.startsAt &&
    moment(eventRef?.current?.startsAt) < eodYesterday;

  function determineHeader() {
    if (location.pathname.includes('tracking')) {
      return 'Attendance Tracking';
    } else if (location.pathname.includes('attendance')) {
      return 'Signups';
    } else {
      return 'Event Info';
    }
  }

  // if we are selecting a new event we want to clear the global
  // editRecurring so that it is false
  React.useEffect(() => {
    if (isNewEvent) {
      Context.setRecurring(false);
    }
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (data) {
      const eodYesterday = moment().subtract(1, 'day');

      const newEvent = get(data, 'community.event');
      const checkIsPastEditEvent =
        !isNewEvent &&
        newEvent?.startsAt &&
        moment(newEvent?.startsAt) < eodYesterday;

      if (!isEqual(data, newEvent)) {
        eventRef.current = newEvent;
        isPastEditEvent = checkIsPastEditEvent;
      }
    }
  }, [data]);

  React.useEffect(() => {
    if (isNewEvent) {
      if (location.state?.source === 'header') {
        sendPendoEvent('event_new_event_main');
      } else if (location.state?.source === 'dayColumn') {
        sendPendoEvent('event_create_new_column');
      }
    }
  }, [isNewEvent]);

  const isPastSignupsEnd = isSignupsEndPast(eventRef.current);

  if (!loading && (eventRef.current || isNewEvent))
    return (
      <ViewWrapper>
        <EventDrawer
          eventName={isNewEvent ? 'New Event' : eventRef.current.name}
          isNewEvent={isNewEvent}
          disabled={isPastEditEvent}
          isPastSignupsEndDate={isPastSignupsEnd}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          selectedDrawer={selectedDrawer}
          setSelectedDrawer={setSelectedDrawer}
        />
        <Hidden mdUp>
          {!drawerOpen && (
            <EventAppBar
              header={determineHeader()}
              setDrawerOpen={setDrawerOpen}
            />
          )}
        </Hidden>
        <Box flex={1} overflow="auto">
          <Route exact path={`${match.url}`}>
            <EventInfo
              disabled={isPastEditEvent}
              isNewEvent={isNewEvent}
              event={eventRef.current}
            />
          </Route>
          <Route exact path={`${match.url}/attendance`}>
            <Signups
              disabled={isPastEditEvent}
              event={eventRef.current}
              refetchEvent={refetch}
            />
          </Route>
          <Route exact path={`${match.url}/attendance/tracking`}>
            <AttendanceTracking
              disabled={isPastEditEvent}
              event={eventRef.current}
              refetchEvent={refetch}
            />
          </Route>
        </Box>
      </ViewWrapper>
    );

  if (!loading && (errors || !(eventRef.current || isNewEvent))) {
    return (
      <ViewWrapper style={{ padding: '20px' }}>
        <Typography color="primary">
          An error seems to have occurred, please try loading again. If this
          persists, please contact support
        </Typography>
      </ViewWrapper>
    );
  }

  return <Loader />;
}

export default Event;
