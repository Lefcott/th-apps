/** @format */

import moment from 'moment-timezone';
import { omit, get as _get } from 'lodash';
import { RRule } from 'rrule';

const initialValuesForNewEvent = {
  _id: 'new',
  name: '',
  status: 'Draft',
  location: null,
  eventType: null,
  numSpots: null,
  calendars: [],
  rule: null,
  duration: 60,
  allDay: false,
  hiddenOn30: false,
  hiddenOn7: false,
  hiddenOn1: false,
  noWrap: false,
  hideEndTime: true,
  costsMoney: false,
  nthDates: [],
  description: '',
  url: null,
  urlDetails: null,
  videoSource: null,
  virtualEventDestinations: null,
  showOnTv: false,
  isAVirtualEvent: false,
  signupsEndDate: null,
  signupsEndTime: null,
};

function handleInitialRRule(rule) {
  if (!rule) {
    return null;
  }
  const options = RRule.parseString(rule);
  // if we had a singular bysetpos, make it an array
  return options;
}

export default function initialData({
  isNew,
  event,
  startDate,
  initialCalendars = {},
}) {
  if (isNew) {
    return {
      ...initialValuesForNewEvent,
      ...initialCalendars,
      startDate,
      startTime: moment().add(1, 'hour').startOf('hour').minute(0).second(0),
    };
  } else {
    const ruleOptions = handleInitialRRule(event?.recurrenceInfo?.rule);
    const initialValues = {
      name: event.name,
      rule: ruleOptions,
      nthDates:
        ruleOptions && ruleOptions.byweekday
          ? [
              ...new Set(
                ruleOptions.byweekday.map(({ n }) => n).filter((i) => i),
              ),
            ]
          : [],
      allDay: event.allDay,
      duration: event.duration,
      description: event.description,
      status: event.publishStatus,
      calendars: event.calendars,
      costsMoney: event.costsMoney,
      location: event.eventLocation ? event.eventLocation._id : null,
      eventType: event.eventType ? event.eventType._id : null,
      numSpots: event.totalSpots === 0 ? null : event.totalSpots,
      totalSpots: event.totalSpots,
      openSpots: event.openSpots,
      startsAt: event.startsAt,
      recurring: event.recurring,
      startDate: event.startsAt,
      startTime: moment()
        .hours(moment(event.startsAt).hours())
        .minutes(moment(event.startsAt).minutes()),
      signupsEndDate: event.signupsEnd || null,
      signupsEndTime: event.signupsEnd
        ? moment()
            .hours(moment(event.signupsEnd).hours())
            .minutes(moment(event.signupsEnd).minutes())
        : null,
      numSignups: event.rsvps.filter(
        (rsvp) => rsvp.status.toLowerCase() === 'registered',
      ).length,
      url: event.url ? event.url : event.url || null,
      urlDetails: event.urlDetails ? event.urlDetails : event.urlDetails || {},
      virtualEventDestinations: event.virtualEventDestinations.length
        ? event.virtualEventDestinations
        : null,
      videoSource: event.videoSource
        ? { ..._get(event, 'urlDetails.videoSourceDetails', {}) }
        : null,
      showOnTv: Boolean(event.virtualEventDestinations.length),
      isAVirtualEvent:
        event.url || event.videoSource || event.virtualEventDestinations.length
          ? true
          : false,
      ...event.calendarSettings,
    };
    const mappedValues = omit(initialValues, [
      '_id',
      '__typename',
      'publishStatus',
    ]);

    return mappedValues;
  }
}
