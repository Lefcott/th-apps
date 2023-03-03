/** @format */
import React from "react";

module.exports = {
  useCurrentUser: jest.fn(),
  getCommunityId: () => "2476",
  useFlags: () => ({
    "teamhub-device-alerts-oven": true,
    "teamhub-device-alerts-leak": true,
    "teamhub-device-alerts-thermostats": true,
  }),
  ReactActionAreaPortal: (props) => <div>{props.children}</div>,
};
