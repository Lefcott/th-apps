/** @format */

const { RRule } = require('rrule');

export const drawerOptions = [
  {
    name: 'eventInfo',
    text: 'Event Info',
    id: 'eventInfo',
    to: '',
    disabledOnCreation: false,
    disabledIfPastSignupsEndDate: false,
  },
  {
    name: 'Manage Attendance',
    text: 'Attendance Tracking',
    id: 'attendanceTracking',
    menu: true,
    to: '/attendance',
    disabledOnCreation: true,
    disabledIfPastSignupsEndDate: false,
    children: [
      {
        text: 'Sign Up & Waitlist',
        id: 'signupsAndWaitlist',
        to: '',
      },
      {
        text: 'Event Attendance',
        id: 'eventAttendance',
        to: '/tracking',
      },
    ],
  },
];

export const statusOptions = [
  {
    name: 'All',
    value: 'all',
  },
  {
    name: 'Draft',
    value: 'draft',
  },
  {
    name: 'Published',
    value: 'published',
  },
  {
    name: 'Archived',
    value: 'archived',
  },
];

export const allStatuses = statusOptions
  .map((status) => status.value)
  .filter((status) => status !== 'all');

export const filterOptions = [
  {
    name: 'eventCalendars',
    summary: 'Calendars',
  },
  {
    name: 'eventTypes',
    summary: 'Event Types',
  },
];

export const repeatOptions = [
  {
    id: 1,
    text: 'Does Not Repeat',
    value: 'doesNotRepeat',
  },
  {
    id: 2,
    text: 'Repeat Daily',
    value: 'repeatDaily',
  },
  {
    id: 3,
    text: 'Repeat Weekly',
    value: 'repeatWeekly',
  },
  {
    id: 4,
    text: 'Repeat Monthly',
    value: 'repeatMonthly',
  },
  {
    id: 5,
    text: 'Custom',
    value: 'custom',
  },
];

export const frequencyOptions = [
  {
    id: 1,
    text: 'Month(s)',
    value: 'MONTHLY',
  },
  {
    id: 2,
    text: 'Week(s)',
    value: 'WEEKLY',
  },
  {
    id: 3,
    text: 'Day(s)',
    value: 'DAILY',
  },
];

export const daysOfWeekOptions = [
  {
    id: 0,
    text: 'Monday',
    value: RRule.MO,
  },
  {
    id: 1,
    text: 'Tuesday',
    value: RRule.TU,
  },
  {
    id: 2,
    text: 'Wednesday',
    value: RRule.WE,
  },
  {
    id: 3,
    text: 'Thursday',
    value: RRule.TH,
  },
  {
    id: 4,
    text: 'Friday',
    value: RRule.FR,
  },
  {
    id: 5,
    text: 'Saturday',
    value: RRule.SA,
  },
  {
    id: 6,
    text: 'Sunday',
    value: RRule.SU,
  },
];
