/** @format */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { useHistory } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import createMockProvider from '../test-utils/createMockProvider';
import LoginForm from '../../components/LoginForm';

// mock out useHistory here for our purposes
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));

describe('Login form tests', () => {
  let pushMock;
  beforeEach(async () => {
    pushMock = jest.fn();
    useHistory.mockReturnValue({
      push: pushMock,
    });
    const MockProvider = createMockProvider({});
    render(<LoginForm />, {
      wrapper: MockProvider,
    });
  });
  it('should render properly on load', async () => {
    screen.findByTestId('TA_login-form');
  });

  it('should redirect you when login successfully', async () => {
    expect(screen.getByTestId('TA_login-form')).toBeInTheDocument();
    const username = 'test-user@k4connect.com';
    const password = 'Testpass123456';
    const emailInput = screen.getByLabelText(/^email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    userEvent.type(emailInput, username);
    await waitFor(() => expect(emailInput).toHaveValue(username));

    userEvent.type(passwordInput, password);

    await waitFor(() => expect(passwordInput).toHaveValue(password));

    await act(async () => {
      await userEvent.click(screen.getByTestId('TA_login-form_submit'));
    });

    // after successful login, setAuthed should be called once
    await waitFor(() => expect(pushMock).toBeCalled());
    await waitFor(() => expect(pushMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/community'));
    await waitFor(() =>
      expect(screen.getByTestId('TA_login-form_submit')).not.toBeDisabled(),
    );
  });

  it('should pop an error message on unsuccessful login', async () => {
    const username = 'bad-user@k4connect.com';
    const password = 'badpass123456';
    userEvent.type(screen.getByLabelText(/^email/i), username);
    await waitFor(() =>
      expect(screen.getByLabelText(/^email/i)).toHaveValue(username),
    );
    userEvent.type(screen.getByLabelText(/^password/i), password);
    await waitFor(() =>
      expect(screen.getByLabelText(/^password/i)).toHaveValue(password),
    );

    await act(async () => {
      await userEvent.click(screen.getByTestId('TA_login-form_submit'));
    });

    await waitFor(() => {
      // there should be an error component in the form
      expect(screen.getByTestId('TA_login-form_error')).toBeInTheDocument();
    });
    await waitFor(() =>
      expect(screen.getByTestId('TA_login-form_submit')).not.toBeDisabled(),
    );
  });

  it('should navigate if you hit forgot password', async () => {
    userEvent.click(screen.getByTestId('TA_login-form_reset-password'));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith('/request-reset');
    });
  });
});
