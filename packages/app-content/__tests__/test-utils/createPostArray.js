/** @format */

import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

export default function makePostArray(length = 10, status = 'active', page) {
  let dates = [];
  switch (status) {
    case 'active':
      dates = [
        DateTime.local().minus({ days: 1 }).toISO(),
        DateTime.local().plus({ days: 4 }).toISO(),
      ];
      break;
    case 'archived':
      dates = [
        DateTime.local().minus({ days: 2 }).toISO(),
        DateTime.local().minus({ days: 1 }).toISO(),
      ];
      break;
    case 'upcoming':
      dates = [
        DateTime.local().plus({ days: 1 }).toISO(),
        DateTime.local().plus({ days: 3 }).toISO(),
      ];
  }

  return Array.from({ length }).map((_, i) => ({
    _id: uuid(),
    title: `Test Post ${page ? i + page * 10 : i}`,
    body: 'Feed Container Test',
    author: 'Unit Tester',
    category: 'Notice',
    audiences: i % 2 === 0 ? ['Resident'] : ['Family'],
    tags: ['Unit Tests'],
    startDate: dates[0],
    endDate: dates[1] || null,
    assets: [
      {
        contentId: uuid(),
        name: 'link asset',
        type: 'Web',
        contentId: null,
        url: 'https://http.cat',
        details: {
          name: 'http cats website',
        },
        __typename: 'Asset',
      },
    ],
    __typename: 'Post',
  }));
}
