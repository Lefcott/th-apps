/** @format */

import React from 'react';
import { screen, render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContentPreview from '../../../src/components/ContentPreview';

describe('ContentPreview', () => {
  let minProps;
  let mockOnClick;

  beforeEach(async () => {
    mockOnClick = jest.fn();
    minProps = {
      data: {
        images: ['image.png'],
      },
      onClick: mockOnClick,
    };

    await act(async () => {
      render(<ContentPreview {...minProps} />);
    });
  });

  it('should display spinner while in loading state', () => {
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should called call on click when clicked on component', async () => {
    await act(async () => {
      userEvent.click(
        await screen.findByTestId('AP_postmodal-content-preview'),
      );
    });

    expect(mockOnClick).toHaveBeenCalled();
  });
});
