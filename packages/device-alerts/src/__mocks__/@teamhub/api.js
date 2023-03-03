/** @format */
import React from "react";

module.exports = {
  navigate: jest.fn(),
  useCurrentUser: jest.fn(),
  getCommunityId: () => "2476",
  ReactActionAreaPortal: (props) => <div>{props.children}</div>,
};
