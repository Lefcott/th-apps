/** @format */

import React, { useState, useContext, useEffect } from 'react';
import State from './StateProvider';
import { getOneSearchParam } from '../utils/url';
import { useDebouncedEffect } from '../utils/hooks';
import { CalendarLoader } from '../utils/loaders';
import moment from 'moment-timezone';
import styled from '@emotion/styled';
import {
  filter,
  isEmpty,
  isEqual,
  orderBy,
  clone,
  set,
  flatten,
  includes,
  map,
} from 'lodash';
import { Grid } from '@material-ui/core';
import WeekNavHeader from './WeekNavHeader';
import DayHeader from './DayHeader';
import DayEventsList from './DayEventsList';
import { GET_EVENTS } from '../graphql/events';
import { useQuery } from '@teamhub/apollo-config';
import broken from '../assets/broken.svg';
import { expandEvent } from '../utils/recurrence';
import { allStatuses } from '../utils/componentData';

const CalWrapper = styled(Grid)`
  height: 100%;
  display: flex;
  flex-flow: column;
  position: relative;
  height: 100%;
  max-height: 100%;
`;

const WeekWrapper = styled(Grid)`
  flex: 1 1 auto;
  overflow: auto;
  height: 100%;
  max-height: 100%;

  @media (max-width: 960px) {
    height: 100vh;
    padding-bottom: 5rem;

    flex-flow: column;
    && {
      flex-wrap: nowrap;
    }
  }
`;

const DayColumn = styled(Grid)`
  display: flex;
  flex-flow: column;
  min-width: 0;
  height: 100%;

  @media (max-width: 960px) {
    flex-flow: row;
    min-height: 50%;
  }
`;

const ErrorState = styled(Grid)`
  overflow: auto;
  height: 60%;
`;

function WeekCalendar(props) {
  const [weekDates, setWeekDates] = useState([]);
  const Context = useContext(State);
  const {
    date,
    statuses,
    eventCalendars = [],
    eventTypes,
    keyword,
  } = Context.filters;
  const { timezone } = Context;
  const hasNoData =
    isEmpty(statuses) || isEmpty(eventCalendars) || isEmpty(eventTypes);
  const communityId = getOneSearchParam('communityId', '14');
  function generateDateRange(date) {
    const anchor = moment(date);
    const start = anchor.clone().startOf('week');
    const end = anchor.clone().endOf('week');
    return [start, end];
  }

  const from = getOneSearchParam('from', null)
  if(from === 'creator') {
    window.close()
  }

  const [startOfWeek, endOfWeek] = generateDateRange(date);
  const { error: eventsError, loading, refetch, data } = useQuery(GET_EVENTS, {
    variables: {
      communityId,
      limit: 500,
      startDate: startOfWeek,
      endDate: endOfWeek,
      statuses,
      search: keyword,
      calendars: eventCalendars,
      eventTypes,
    },
    context: { debounceKey: 'GET_EVENTS', debounceTimeout: 700 },
    fetchPolicy: 'cache-and-network',
    skip: isEqual(eventCalendars[0], 'initialCal'),
    onError: (err) => console.warn(err),
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    if (hasNoData) {
      const datesArr = clone(weekDates);
      datesArr.forEach((date) => (date.events = []));
      setWeekDates(datesArr);
    } else {
      const { events } = data.community.getEvents;
      const [start, end] = generateDateRange(date);
      const expandedEvents = flatten(
        events.map((event) =>
          expandEvent(event, new Date(start), new Date(end), timezone),
        ),
      );
      // if we have a status filter, make sure we filter any instances that do not apply
      if (allStatuses.some((status) => includes(statuses, status))) {
        return assignEvents(
          expandedEvents.filter((instance) => {
            return includes(statuses, instance.publishStatus.toLowerCase());
          }),
        );
      }
      assignEvents(expandedEvents);
    }
  }, [data]);

  useDebouncedEffect(
    () => {
      setWeekDates(getWeekArr());
    },
    [date],
    0,
  );

  const getWeekArr = () => {
    let currentDate = startOfWeek;
    const dateArr = [];
    while (currentDate <= endOfWeek) {
      let dateObj = { date: currentDate };
      if (hasNoData) dateObj.events = [];
      dateArr.push(dateObj);
      currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArr;
  };

  const assignEvents = (events) => {
    const eventfulDays = weekDates.map((weekDate) => {
      const eventsArr = filter(events, (ev) =>
        moment(ev.startsAt).isSame(weekDate.date, 'day'),
      );
      set(weekDate, 'events', eventsArr);
      return weekDate;
    });
    setWeekDates(eventfulDays);
  };

  const removeEvent = (event, fromDate) => {
    const eventfulDays = weekDates.map((weekDate) => {
      const eventsArr = filter(weekDate.events, (ev) => {
        const isSameEvent = ev.eventId === event.eventId;
        const isSameOrAfter = moment(weekDate.date).isSameOrAfter(
          fromDate,
          'day',
        );
        const isSameDay = moment(weekDate.date).isSame(event.startsAt, 'day');

        return !(
          isSameEvent &&
          ((fromDate && isSameOrAfter) || (!fromDate && isSameDay))
        );
      });
      set(weekDate, 'events', eventsArr);
      return weekDate;
    });
    setWeekDates(eventfulDays);
  };

  const changeEventPublishStatus = (event, fromDate, publishStatus) => {
    const eventfulDays = weekDates.map((weekDate) => {
      const eventsArr = map(weekDate.events, (ev) => {
        const isSameEvent = ev.eventId === event.eventId;
        const isSameOrAfter = moment(weekDate.date).isSameOrAfter(
          fromDate,
          'day',
        );
        const isSameDay = moment(weekDate.date).isSame(event.startsAt, 'day');

        if (
          isSameEvent &&
          ((fromDate && isSameOrAfter) || (!fromDate && isSameDay))
        ) {
          ev.publishStatus = publishStatus;
        }

        return ev;
      });
      set(weekDate, 'events', eventsArr);
      return weekDate;
    });
    setWeekDates(eventfulDays);
  };

  const orderEvents = (events) => {
    const mappedEvents = clone(events).map((event) => {
      const adjustedStartsAt = moment(event.startsAt).startOf('minute');
      const adjustedEndsAt = moment(event.endsAt).startOf('minute');
      return { ...event, adjustedStartsAt, adjustedEndsAt };
    });
    const properties = ['allDay', 'adjustedStartsAt', 'adjustedEndsAt', 'name'];
    const relativeSorts = ['desc', 'asc', 'asc', 'asc'];
    const orderedEvents = orderBy(mappedEvents, properties, relativeSorts);
    return orderedEvents;
  };

  return (
    <CalWrapper item open={props.isDrawerOpen} id="Em_weekCalendar" xs>
      <WeekNavHeader
        isDrawerOpen={props.isDrawerOpen}
        setIsDrawerOpen={props.setIsDrawerOpen}
        date={date}
        startOfWeek={startOfWeek}
        endOfWeek={endOfWeek}
        loadEvents={refetch}
      />
      {eventsError ? (
        <ErrorState container alignItems="center" justify="center">
          <Grid item>
            <img src={broken} alt="Something has gone wrong" />
          </Grid>
        </ErrorState>
      ) : (
        <WeekWrapper container>
          {weekDates.map((weekDate) => (
            <DayColumn
              item
              key={weekDate.date}
              className={`Em_weekCalendar-dayCol Em_weekCalendar-dayCol-date-${moment(
                weekDate.date,
              ).format('D')}`}
              xs
            >
              <DayHeader date={weekDate.date} />
              {!loading && weekDate.events ? (
                <DayEventsList
                  events={orderEvents(weekDate.events)}
                  removeEvent={removeEvent}
                  changeEventPublishStatus={changeEventPublishStatus}
                  className={'Em_weekCalendar-eventHolder'}
                  date={weekDate.date}
                  startOfWeek={startOfWeek}
                />
              ) : (
                <CalendarLoader />
              )}
            </DayColumn>
          ))}
        </WeekWrapper>
      )}
    </CalWrapper>
  );
}

export default WeekCalendar;
