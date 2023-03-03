/** @format */
import React from 'react';

module.exports = {
  useCurrentUser: jest.fn(),
  getCommunityId: () => '2476',
  ReactActionAreaPortal: (props) => <div>{props.children}</div>,
  useFlags: jest
    .fn()
    .mockImplementation(() => ({ 'teamhub-staff-reveal-toggles': true })),
  sendPendoEvent: jest.fn(),
};
