/** @format */

import React from 'react';
// very basic mock of getCurrentUser
export function getCurrentUser() {
  const user = {
    _id: 'Some id',
    firstName: 'Test',
    lastName: 'User',
    fullName: 'Test User',
    community: {
      _id: '2476',
      name: 'Community 2.0',
      timezone: {
        name: 'America/New_York',
      },
    },
  };
  return {
    subscribe: (callback) => {
      callback(user);
    },
  };
}

// mock the portal to simply return the children, rather than
// render in the teamhub nav
export const ReactActionAreaPortal = (props) => <div>{props.children}</div>;

export const getAuthToken = () => 'faketoken';
