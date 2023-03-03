/** @format */

import { RRuleSet, RRule } from 'rrule';
import { DateTime } from 'luxon';
import _ from 'lodash';

// this is required in order to handle DST properly
// and it is a huge pain in the ass
function constructTimezoneAdjustedDate(date, timezone) {
  const dateCopy = new Date(new Date(date).getTime());
  const luxonDate = DateTime.fromJSDate(dateCopy, { zone: timezone });
  const offset = luxonDate.offset;
  dateCopy.setTime(dateCopy.getTime() + offset * 60 * 1000);
  return dateCopy;
}

export function expandEvent(event, startDate, endDate, timezone) {
  if (!event.recurrenceInfo) {
    return event;
  }
  const ruleOptions = RRule.parseString(event?.recurrenceInfo?.rule);
  if (ruleOptions.until) {
    ruleOptions.until = constructTimezoneAdjustedDate(
      ruleOptions.until,
      timezone,
    );
  }
  const rrule = new RRule({
    ...ruleOptions,
    byhour: null,
    byminute: null,
    bysecond: null,
    dtstart: constructTimezoneAdjustedDate(event.startsAt, timezone),
  });
  const rruleSet = new RRuleSet();
  rruleSet.rrule(rrule);
  event.recurrenceInfo.exceptions.forEach((exdate) =>
    rruleSet.exdate(constructTimezoneAdjustedDate(exdate, timezone)),
  );

  const start = constructTimezoneAdjustedDate(startDate, timezone);
  const end = constructTimezoneAdjustedDate(endDate, timezone);
  const instances = rruleSet.between(start, end, true);
  const statusExceptionsObj = _.keyBy(
    event.recurrenceInfo.statusExceptions,
    ({ date }) => DateTime.fromISO(date, { zone: timezone }).toISO(),
  );

  return instances.map((date) => {
    const timezoneAdjustedInstance = DateTime.fromJSDate(date)
      .toUTC()
      .setZone(timezone, { keepLocalTime: true });
    return {
      ...event,
      publishStatus:
        statusExceptionsObj[timezoneAdjustedInstance.toISO()]?.status ||
        event.publishStatus,
      startsAt: timezoneAdjustedInstance.toJSDate(),
      endsAt: timezoneAdjustedInstance
        .plus({ minutes: event.duration })
        .toJSDate(),
    };
  });
}
