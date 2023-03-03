/**
 * Event Week Calendar component namespace, this is the big calendar  that has all the events on it
 *
 * @format
 * @prop {string} NextWeek the selector for the next week button
 * @prop {string} NextWeekDisabled the selector for the next week but only if its disabled
 * @prop {string} PrevWeek the selector for the previous week
 * @prop {string} WeekCalEvent the selector for one of the events on the weekly calendar
 * @prop {function} WeekCalByDate the selector for one of the events on the weekly calendar but also takes a date (ie. 15) so you can get a specific date column
 * @prop {string} LastEvent the selector for the last event in a row on the weekly calendar
 */

export default {
  NextWeek: '#Em_calendar-next',
  NextWeekDisabled: '#Em_calendar-next.Mui-disabled',
  PrevWeek: '#Em_calendar-prev',
  WeekCalEvent: '.Em_calendarEvent',
  WeekCalByDate: (d) => `.Em_weekCalendar-dayCol-date-${d}`,
  LastEvent: '.Em_calendarEvent:last-child()',
};
