/** @format */

import { moment } from 'moment-timezone';
/** @format */
/**
 * Events Month Calendar component namespace, this is the little calendar in the sidenav
 * @prop {string} cal the selector for the container the monthly calendar is in
 * @prop {function} header the selector for the header for month calendar (has date in it ie. MARCH 2020)
 * @prop {string} nextMonth the selector for the next month
 * @prop {string} nextMonthDisabled the selector for the next month but only if its disabled
 * @prop {string} prevMonth the selector for the previous month
 * @prop {function} day the selector for one of the days, takes the day you want (eg. MC.day(15) will return the selector for the 15th for the currently selected month)
 */

export default {
  cal: `#Em_monthCalendar`,
  header: `.MuiPickersSlideTransition-transitionContainer`,
  nextMonth: `#Em_Month-calendar-next-month`,
  nextMonthDisabled: `#Em_Month-calendar-next-month.Mui-disabled`,
  prevMonth: `#Em_Month-calendar-prev-month`,
  day: (day) => `.MuiPickersDay-day`,
};
