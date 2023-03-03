/** @format */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useHistory } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { setSelectedCommunity, useCurrentUser, navigate } from '@teamhub/api';
import createMockProvider from '../test-utils/createMockProvider';
import CommunitySelector from '../../components/CommunitySelector';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));

const MOCK_COMMUNITIES = [
  { _id: '2476', name: 'Community 2.0' },
  { _id: '14', name: 'Operational Test Bed ' },
];

describe('CommunitySelector', () => {
  let pushMock;
  let MockProvider = createMockProvider({});
  beforeEach(async () => {
    pushMock = jest.fn();
    useCurrentUser.mockImplementation((options) => {
      const user = {
        username: 'test-user@k4connect.com',
        communities: MOCK_COMMUNITIES,
      };
      options.onCompleted(user);
      return [user, false];
    });
    setSelectedCommunity.mockImplementation((id) => {
      localStorage.setItem('selectedCommunity', id);
    });
    useHistory.mockReturnValue({
      push: pushMock,
    });
  });

  afterEach(() => {
    localStorage.removeItem('selectedCommunity');
    jest.clearAllMocks();
  });

  it('Should render a community selector form and all contents when passed multiple community options', async () => {
    render(<CommunitySelector />, { wrapper: MockProvider });
    expect(
      screen.getByTestId('TA_community-selector_container'),
    ).toBeInTheDocument();

    // should be disabled on load
    expect(screen.getByTestId('TA_community-selector_submit')).toBeDisabled();

    // for reference when testing material autocompletes:
    // https://github.com/mui-org/material-ui/blob/master/packages/material-ui-lab/src/Autocomplete/Autocomplete.test.js
    const autocomplete = screen.getByRole('textbox');
    // click into the component
    autocomplete.focus();
    // simulate beginning to type "Community"
    fireEvent.change(document.activeElement, { target: { value: 'Comm' } });
    // arrow down to first option
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    // select element
    fireEvent.keyDown(document.activeElement, { key: 'Enter' });

    expect(autocomplete.value).toEqual('Community 2.0');
    expect(
      screen.getByTestId('TA_community-selector_submit'),
    ).not.toBeDisabled();
  });

  it('Should add selected community to local storage on submit', async () => {
    // mock out setting our community func
    useCurrentUser.mockReturnValue([
      {
        username: 'test-user@k4connect.com',
        communities: MOCK_COMMUNITIES,
      },
      false,
    ]);
    render(<CommunitySelector />, { wrapper: MockProvider });
    const autocomplete = screen.getByRole('textbox');
    // click into the component
    autocomplete.focus();
    // simulate beginning to type "Community"
    fireEvent.change(document.activeElement, { target: { value: 'Comm' } });
    // arrow down to first option
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    // select element
    fireEvent.keyDown(document.activeElement, { key: 'Enter' });

    userEvent.click(screen.getByTestId('TA_community-selector_submit'));

    await waitFor(() => {
      expect(setSelectedCommunity).toBeCalledTimes(1);
      expect(localStorage.getItem('selectedCommunity')).toEqual('2476');
      expect(navigate).toBeCalledTimes(1);
      expect(navigate).toBeCalledWith('/?communityId=2476');
    });
  });

  it('Should automatically redirect on load if the props contain just one community', async () => {
    useCurrentUser.mockImplementationOnce((options) => {
      const user = {
        username: 'test-user@k4connect.com',
        communities: MOCK_COMMUNITIES.slice(1),
      };
      options.onCompleted(user);
      return [user, false];
    });
    render(<CommunitySelector />, { wrapper: MockProvider });

    await waitFor(() => {
      expect(localStorage.getItem('selectedCommunity')).toEqual('14');
      expect(navigate).toBeCalledTimes(1);
      expect(navigate).toBeCalledWith('/?communityId=14');
    });
  });

  it('Should automatically redirect back to the login form if you are not logged in', async () => {
    useCurrentUser.mockImplementationOnce((options) => {
      const user = null;
      options.onCompleted(user);
      return [user, false];
    });
    render(<CommunitySelector />, { wrapper: MockProvider });

    await waitFor(() => {
      expect(pushMock).toBeCalledTimes(1);
      expect(pushMock).toBeCalledWith('/');
    });
  });
});
