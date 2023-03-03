import React from 'react';
import {
  act,
  screen,
  render,
} from '@testing-library/react';
import wait from 'waait';
import userEvent from '@testing-library/user-event'
import createProvider from '@test-utils/createProvider'
import NavigateAwayModal from '@src/navigate-away-modal/components/NavigateAwayModal'

describe('NavigateAwayModal', () => {
  let mockUnmountSelf;
  let mockOnSaveAndExit;
  let mockOnExit;
  let mockOnCancel;

  beforeEach(async () => {
    mockUnmountSelf = jest.fn();
    mockOnSaveAndExit = jest.fn();
    mockOnExit = jest.fn();
    mockOnCancel = jest.fn();

    let minProps = {
      parcelData: {
        onSaveAndExit: mockOnSaveAndExit,
        onExit: mockOnExit,
        onCancel: mockOnCancel,
      },
      unmountSelf: mockUnmountSelf,
    }

    const TestContextProvider = createProvider();

    act(() => {
      render(<NavigateAwayModal {...minProps} />, {
        wrapper: TestContextProvider
      });
    });

    await wait(0);
  })

  it ('should be able to close modal', async () => {
    await userEvent.click(screen.getByLabelText('close-modal'));
    expect(mockUnmountSelf).toHaveBeenCalled();
    expect(mockOnCancel).toHaveBeenCalled();
    expect(mockOnSaveAndExit).not.toHaveBeenCalled();
    expect(mockOnExit).not.toHaveBeenCalled();
  })

  it('should be able to exit and save', async () => {
    await userEvent.click(screen.getByText(/Save & Exit/i));
    expect(mockOnCancel).not.toHaveBeenCalled();
    expect(mockOnSaveAndExit).toHaveBeenCalled();
    expect(mockOnExit).not.toHaveBeenCalled();
  })

  it('should be able to exit without saving', async () => {
    await userEvent.click(screen.getByText(/Exit without Saving/i));
    expect(mockUnmountSelf).toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();
    expect(mockOnSaveAndExit).not.toHaveBeenCalled();
    expect(mockOnExit).toHaveBeenCalled();
  })
})