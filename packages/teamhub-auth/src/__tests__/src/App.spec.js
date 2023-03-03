/** @format */

import React from 'react';
import App from '../../App';
import { setSelectedCommunity, useCurrentUser, navigate } from '@teamhub/api';
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('App', () => {
  beforeEach(() => {
    setSelectedCommunity.mockImplementation((id) => {
      localStorage.setItem('selectedCommunity', id);
    });
  });

  afterEach(() => jest.clearAllMocks());

  it('Simulate login flow', async () => {
    // first time, pass null,
    // second time this fires it should then pass a user obj
    // third time is because the community selector rerenders when you select a community
    useCurrentUser
      .mockImplementationOnce(({ onCompleted }) => {
        onCompleted(null);
        return [null, false];
      })
      .mockImplementationOnce((options) => {
        const user = {
          username: 'test-user@k4connect.com',
          communities: [
            { _id: '2476', name: 'Community 2.0' },
            { _id: '14', name: 'Operational Test Bed ' },
          ],
        };
        options.onCompleted(user);
        return [user, false];
      })
      .mockImplementationOnce((options) => {
        const user = {
          username: 'test-user@k4connect.com',
          communities: [
            { _id: '2476', name: 'Community 2.0' },
            { _id: '14', name: 'Operational Test Bed ' },
          ],
        };
        options.onCompleted(user);
        return [user, false];
      });
    render(<App />);

    expect(screen.getByTestId('TA_auth-root')).toBeInTheDocument();
    expect(screen.getByTestId('TA_login-form')).toBeInTheDocument();
    expect(() =>
      screen
        .getByTestId('TA_community-selector_container')
        .toThrow(
          'Unable to find an element by: [data-testid="TA_community-selector_container"]',
        ),
    );

    // input login information
    const username = 'test-user@k4connect.com';
    const password = 'Testpass123456';
    const emailInput = screen.getByLabelText(/^email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    userEvent.type(emailInput, username);
    userEvent.type(passwordInput, password);

    // click to submit login form
    await act(async () =>
      userEvent.click(screen.getByTestId('TA_login-form_submit')),
    );

    await waitFor(() =>
      expect(() =>
        screen
          .getByTestId('TA_login-form')
          .toThrow(
            'Unable to find an element by: [data-testid="TA_login-form"]',
          ),
      ),
    );
    await waitFor(() =>
      expect(
        screen.getByTestId('TA_community-selector_container'),
      ).toBeInTheDocument(),
    );

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
});
