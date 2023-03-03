/** @format */

import React from 'react';
import { useHistory } from 'react-router-dom';
import createMockProvider from '../test-utils/createMockProvider';
import { waitFor, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SSO_ENDPOINT } from '../../utils/environment';
import RequestReset from '../../components/RequestReset';
import { server, rest } from '../test-utils/mock-server';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));

const SEND_EMAIL_BUTTON_TEXT = /send email/i;

describe('Forgot Password', () => {
  let pushMock;
  beforeEach(() => {
    pushMock = jest.fn();
    useHistory.mockReturnValue({
      push: pushMock,
    });
    const MockProvider = createMockProvider({});
    render(<RequestReset />, {
      wrapper: MockProvider,
    });
  });

  it('Should render properly on load', async () => {
    expect(screen.getByTestId('TA_forgot-password_form')).toBeInTheDocument();
    expect(screen.getByText(SEND_EMAIL_BUTTON_TEXT)).toBeInTheDocument();
  });

  it('Should allow you to enter an email address and send password reset email', async () => {
    const textField = screen.getByLabelText(/^email/i);

    userEvent.type(textField, 'test-user@k4connect.com');
    userEvent.click(screen.getByText(SEND_EMAIL_BUTTON_TEXT));

    await waitFor(() => {
      expect(screen.getByText('Log In')).toBeInTheDocument();
      expect(screen.getByText('test-user@k4connect.com')).toBeInTheDocument();
      expect(screen.getByText('This link will expire in 15 minutes'));
    });
  });

  it('Should show error text if the email you provide does not exist in the k4 system', async () => {
    // one off msw handler
    server.use(
      rest.post(`${SSO_ENDPOINT}/users/password/forgot`, (req, res, ctx) => {
        return res.once(
          ctx.status(404),
          ctx.json({ message: 'Email not found' }),
        );
      }),
    );
    const textField = screen.getByLabelText(/^email/i);

    userEvent.type(textField, 'bad-user@k4connect.com');
    userEvent.click(screen.getByText(SEND_EMAIL_BUTTON_TEXT));
    await waitFor(() => {
      expect(
        screen.getByText(
          'The email you entered is not in our system. Please enter a valid email address.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('Should allow you to navigate back to the login page', async () => {
    const textField = screen.getByLabelText(/^email/i);

    userEvent.type(textField, 'test-user@k4connect.com');
    userEvent.click(screen.getByText(SEND_EMAIL_BUTTON_TEXT));

    await waitFor(() =>
      expect(screen.getByText(/^log in/i)).toBeInTheDocument(),
    );

    userEvent.click(screen.getByText(/^log in/i));
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/');
      expect(pushMock).toHaveBeenCalledTimes(1);
    });
  });
});
