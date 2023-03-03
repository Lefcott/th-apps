/** @format */

import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import wait from 'waait';
import userEvent from '@testing-library/user-event';
import createMockProvider from '../test-utils/createMockProvider';
import ResetPassword from '../../components/ResetPassword';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));

describe('Reset Password Component', () => {
  let pushMock;
  beforeEach(() => {
    pushMock = jest.fn();
    useHistory.mockReturnValue({
      push: pushMock,
    });
  });
  afterEach(() => jest.clearAllMocks());

  it('Should render successfully with a valid token', async () => {
    const mockProvider = createMockProvider({
      routerProps: { initialEntries: ['/reset?token=goodtoken'] },
    });
    render(<ResetPassword />, { wrapper: mockProvider });
    wait(0);
    await waitFor(() =>
      expect(screen.getByTestId('TA_reset-password_form')).toBeInTheDocument(),
    );
  });

  it('Should redirect to request-reset if no token is supplied', async () => {
    const mockProvider = createMockProvider({
      routerProps: { initialEntries: ['/reset'] },
    });
    render(<ResetPassword />, { wrapper: mockProvider });

    await waitFor(() => {
      expect(pushMock).toBeCalledTimes(1);
      expect(pushMock).toBeCalledWith('/request-reset');
    });
  });
  it('Should redirect to request-reset with invalid token state if no token is supplied', async () => {
    const mockProvider = createMockProvider({
      routerProps: { initialEntries: ['/reset?token=badtoken'] },
    });
    render(<ResetPassword />, { wrapper: mockProvider });

    await waitFor(() => {
      expect(pushMock).toBeCalledTimes(1);
      expect(pushMock).toBeCalledWith('/request-reset', {
        tokenInvalid: 'This link has expired',
      });
    });
  });

  it('Should allow you to submit a new password', async () => {
    const newPassword = 'Newpassword123';
    const mockProvider = createMockProvider({
      routerProps: { initialEntries: ['/reset?token=goodtoken'] },
    });
    render(<ResetPassword />, { wrapper: mockProvider });

    await waitFor(() =>
      expect(screen.getByTestId('TA_reset-password_form')).toBeInTheDocument(),
    );
    // validation modal should pop
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i);
    passwordInput.focus();

    await waitFor(() => {
      expect(
        screen.getByTestId('TA_reset-password-validator'),
      ).toBeInTheDocument();
    });

    userEvent.type(passwordInput, newPassword);
    passwordInput.blur();

    userEvent.type(confirmPasswordInput, newPassword);
    await waitFor(() => {
      expect(passwordInput).toHaveValue(newPassword);
      expect(confirmPasswordInput).toHaveValue(newPassword);
    });

    userEvent.click(screen.getByText(/^save$/i));

    await waitFor(() => {
      expect(screen.getByText(/^log in$/i)).toBeInTheDocument();
    });

    userEvent.click(screen.getByText(/^log in$/i));

    await waitFor(() => {
      expect(pushMock).toBeCalledTimes(1);
      expect(pushMock).toBeCalledWith('/');
    });
  });
});
