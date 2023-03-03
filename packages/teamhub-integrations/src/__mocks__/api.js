/** @format */
import React from "react";

module.exports = {
  useCurrentUser: jest.fn(),
  getCommunityId: () => "2476",
  ReactActionAreaPortal: (props) => <div>{props.children}</div>,
  showToast: jest.fn(),
};
