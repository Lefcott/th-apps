/** @format */

import { DateTime } from 'luxon';

const isSignupsEndPast = (event) => {
  if (event?.signupsEnd) {
    const signupsEnd = DateTime.fromISO(event.signupsEnd);
    const now = DateTime.now();
    return now > signupsEnd;
  }
  return false;
};

export { isSignupsEndPast };
