/** @format */

import React from 'react';
import { screen, render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PreviewSection from '../../../src/components/PreviewSection';

describe('ContentPreview', () => {
  let minProps;
  let mockSetUploadType;
  let mockSetDocumentArr;

  beforeEach(async () => {
    mockSetUploadType = jest.fn();
    mockSetDocumentArr = jest.fn();

    minProps = {
      uploadType: 'design',
      setUploadType: mockSetUploadType,
      documentArr: [
        {
          url: 'test.png',
          _id: 'test-id',
          images: ['test.png'],
          name: 'test name',
        },
      ],
      setDocumentArr: mockSetDocumentArr,
    };
  });

  it('should display thumbnail image for design', () => {
    render(<PreviewSection {...minProps} />);
    expect(screen.getByRole('content-preview-image')).toHaveAttribute(
      'src',
      'test.thumb.png',
    );
  });

  it('should display thumbnail image for photo', () => {
    minProps.uploadType = 'photo';
    render(<PreviewSection {...minProps} />);

    expect(screen.getByRole('content-preview-image')).toHaveAttribute(
      'src',
      'test.thumb.png',
    );
  });

  it('should display document name', () => {
    minProps.uploadType = 'document';
    render(<PreviewSection {...minProps} />);
    expect(screen.getByText(minProps.documentArr[0].name)).toBeInTheDocument();
  });

  it('should remove content preview when clicked on remove button', () => {
    render(<PreviewSection {...minProps} />);
    act(() => {
      userEvent.click(screen.getByRole('remove-content-preview'));
    });
    expect(mockSetDocumentArr).toHaveBeenCalledWith([]);
  });
});
