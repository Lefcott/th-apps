/** @format */

import { graphql } from 'msw';
import { events, eventLocations, eventCalendars } from './mockData';
import { DateTime } from 'luxon';

function generateTimeFrame(anchoredAt, timeframe) {
  const start = DateTime.fromJSDate(new Date(anchoredAt)).startOf(
    timeframe.toLowerCase(),
  );
  const end = DateTime.fromJSDate(new Date(anchoredAt)).endOf(
    timeframe.toLowerCase(),
  );
  return [start, end];
}

function checkRange(range, event) {
  try {
    const [start, end] = range;
    // check to see if startDate is between the range
    const { milliseconds: endDiff } = end
      .diff(DateTime.fromISO(event.startsAt), 'milliseconds')
      .toObject();
    const { milliseconds: startDiff } = DateTime.fromISO(event.startsAt)
      .diff(start, 'milliseconds')
      .toObject();
    if (endDiff > 0 && startDiff >= 0) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

export const handlers = [
  graphql.query('getEventsForDownload', (req, res, ctx) => {
    const { anchoredAt, timeframe, calendars } = req.variables;
    const range = generateTimeFrame(anchoredAt, timeframe);
    const eventsToReturn = events
      .filter((event) => {
        let shouldReturn = true;
        if (calendars) {
          const match = event.calendars.some(({ _id }) =>
            calendars.includes(_id),
          );

          if (!match) {
            shouldReturn = false;
          }
        }
        return shouldReturn;
      })
      .filter((event) => checkRange(range, event));

    return res(
      ctx.data({
        community: {
          timezone: {
            name: 'America/New_York',
          },
          events: eventsToReturn,
        },
      }),
    );
  }),

  graphql.query('getCalendars', (req, res, ctx) => {
    return res(
      ctx.data({
        community: {
          eventCalendars,
        },
      }),
    );
  }),

  graphql.query('getLocations', (req, res, ctx) => {
    return res(
      ctx.data({
        community: {
          eventLocations,
        },
      }),
    );
  }),
];
