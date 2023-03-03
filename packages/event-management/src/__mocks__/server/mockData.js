/** @format */

import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';
import {
  floorToLocalWeek,
  ceilToLocalWeek,
} from '../../components/DownloadEventsTimeRangeSelector';

const currentDate = DateTime.local();

const eventCalendars = [
  {
    _id: uuid(),
    name: 'Wellness',
    priority: 1,
  },
  {
    _id: uuid(),
    name: 'Spirituality',
    priority: 2,
  },
];

const eventLocations = [
  {
    _id: 1553,
    name: 'Assisted Living',
    abbr: 'AL',
    color: '#fa0f0f',
    __typename: 'EventLocation',
  },
  {
    _id: 1176,
    name: 'Dining Hall',
    abbr: 'DH',
    color: '#d529dd',
    __typename: 'EventLocation',
  },
  {
    _id: 1172,
    name: 'Fit & Move Room',
    abbr: 'F&M',
    color: '#e82d2d',
    __typename: 'EventLocation',
  },
];

const events = [
  {
    _id: uuid(),
    name: 'Event happening today',
    startsAt: currentDate.startOf('month').toISO(),
    endsAt: currentDate.endOf('day').toISO(),
    allDay: true,
    recurring: true,
    publishStatus: 'Published',
    description: null,
    location: 'Dining Hall',
    calendars: eventCalendars,
  },
  {
    _id: uuid(),
    name: 'Event tomorrow',
    startsAt: currentDate.plus({ days: 1 }).startOf('day').toISO(),
    endsAt: currentDate.plus({ days: 1 }).endOf('day').toISO(),
    allDay: true,
    recurring: true,
    publishStatus: 'Published',
    description: null,
    location: 'Dining Hall',
    calendars: eventCalendars,
  },
  {
    _id: uuid(),
    name: 'Event next week',
    startsAt: floorToLocalWeek(currentDate.plus({ weeks: 1 })).toISO(),
    endsAt: ceilToLocalWeek(currentDate.plus({ weeks: 1 })).toISO(),
    allDay: true,
    recurring: true,
    publishStatus: 'Published',
    description: null,
    location: 'Dining Hall',
    calendars: eventCalendars,
  },
  {
    _id: uuid(),
    name: 'Current month event on one calendar',
    startsAt: currentDate.startOf('month').toISO(),
    endsAt: currentDate.endOf('day').toISO(),
    allDay: true,
    recurring: true,
    publishStatus: 'Published',
    description: null,
    location: 'Assisted Living',
    calendars: eventCalendars.slice(0, 1),
  },
  {
    _id: uuid(),
    name: 'Next Month Event',
    startsAt: currentDate.plus({ months: 1 }).startOf('month').toISO(),
    endsAt: currentDate.plus({ months: 1 }).endOf('month').toISO(),
    allDay: true,
    recurring: true,
    publishStatus: 'Published',
    description: null,
    location: 'Assisted Living',
    calendars: eventCalendars,
  },
  {
    _id: uuid(),
    name: 'Event two months out',
    startsAt: currentDate.plus({ months: 2 }).startOf('month').toISO(),
    endsAt: currentDate.plus({ months: 2 }).endOf('month').toISO(),
    allDay: true,
    recurring: true,
    publishStatus: 'Published',
    description: null,
    location: 'Assisted Living',
    calendars: eventCalendars,
  },
];

export { events, eventLocations, eventCalendars };
