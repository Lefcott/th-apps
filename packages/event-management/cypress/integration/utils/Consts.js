/** @format */

import RRule from 'rrule2';
import moment from 'moment-timezone';
import { _Date, _Time } from '../utils/Time';

/**
 * Mapping of how we are currently representing Ordinal Numbers
 * @const ORDINAL_NUMS
 */
export const ORDINAL_NUMS = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
  FOURTH: 4,
  FIFTH: 5,
};

/**
 * Mapping of how we are currently representing Cardinal numbers
 * @const CARDINAL_NUMS
 */
export const CARDINAL_NUMS = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

/**
 * Mapping of how rrule currently represents days of the week
 * @const WEEKDAYS
 */
export const WEEKDAYS = {
  SU: RRule.SU,
  MO: RRule.MO,
  TU: RRule.TU,
  WE: RRule.WE,
  TH: RRule.TH,
  FR: RRule.FR,
  SA: RRule.SA,
};

/**
 * Mapping of how rrule represents how frequently something repeats
 * @const FREQ
 */
export const FREQ = {
  DAILY: RRule.DAILY,
  WEEKLY: RRule.WEEKLY,
  MONTHLY: RRule.MONTHLY,
};
export const eventNamer = () => 'testEvent'; //`Event-${new Date().toLocaleString()}`;
export const EIGHT_THIRTY_AM = _Time.hours(8).minutes(30);
export const NINE_THIRTY_AM = _Time.hours(9).minutes(30);
export const ELEVEN_FORTY_FIVE_PM = _Time.hours(23).minutes(45);
export const TODAY = moment().add(1, 'hours').startOf('hour');
export const TOMORROW = moment().add(1, 'days');
export const A_WEEK_FROM_NOW = moment().add(1, 'week');
export const A_MONTH_FROM_NOW = moment().add(1, 'month');
export const TWO_MONTHS_FROM_NOW = moment().add(2, 'month');

export const eventNames = {
  SINGLE_EVENT_NAME: `TestSingleEvent-${Date.now().toString().slice(-5)}`,
  REOCCURING_EVENT_NAME: `TestReoccuringEvent-${Date.now()
    .toString()
    .slice(-5)}`,
  SINGLE_ARCHIVED_EVENT_NAME: `TestSingleArchivedEvent-${Date.now()
    .toString()
    .slice(-5)}`,
  REOCCURING_ARCHIVED_EVENT_NAME: `TestReoccuringArchivedEvent-${Date.now()
    .toString()
    .slice(-5)}`,
  SINGLE_VIRTUAL_NAME: `VirtualEventTestSingel-${Date.now()
    .toString()
    .slice(-5)}`,
  REOCCURING_VIRTUAL_NAME: `TestReoccuringVirtualEvent-${Date.now()
    .toString()
    .slice(-5)}`,
};
export const EditEventDetails = { VirtualEvent: 'No' };
export const EditEventName = {
  EventName: `EditedTestReoccuringEvent-${Date.now().toString().slice(-5)}`,
};

export const settings = {
  EVENT_TYPE_NAME: `TestEventType-${Date.now().toString().slice(-5)}`,
  EVENT_LOCATION_NAME: `TestLocation-${Date.now().toString().slice(-5)}`,
  EVENT_CALENDAR_NAME: `TestCalendar-${Date.now().toString().slice(-5)}`,
  EDITED_EVENT_LOCATION_NAME: `TestEditedLocation-${Date.now()
    .toString()
    .slice(-5)}`,
  EDITED_EVENT_TYPE_NAME: `TestEditedEventType-${Date.now()
    .toString()
    .slice(-5)}`,
  EDITED_EVENT_CALENDAR_NAME: `TestEditedCalendar-${Date.now()
    .toString()
    .slice(-5)}`,
};

export const GuestInfo = {
  GUEST_NAME: `Newman's Guest`,
};
