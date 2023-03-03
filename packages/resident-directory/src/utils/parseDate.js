/** @format */

import { DateTime } from 'luxon';

// date will be of the format "2017-03-13";
export default function parseDate(date) {
  if (date) {
    const newDate = new Date(DateTime.fromISO(date));
    return newDate;
  }
  return null;
}
