/** @format */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import LinkPreview from '../../../src/components/LinkPreview';

const mockPreviewData = {
  card: 'summary_large_image',
  title: "It's Been a Minute with Sam Sanders",
  site: '@NPR',
  images: [
    {
      url:
        'https://media.npr.org/assets/img/2020/05/29/ibam_arttile_final_wide-c51418e1dbb7a1240a91c48277ed993e03b651be.png?s=1400',
    },
  ],
  protocol: 'twitter_card',
};

describe('LinkPreview', () => {
  let minProps;

  beforeEach(() => {
    minProps = {
      loading: false,
      url: 'https://hostsite.com',
      hasImage: true,
      hasContent: true,
      previewData: mockPreviewData,
    };
  });

  it('should display preview image', async () => {
    await act(async () => {
      render(<LinkPreview {...minProps} />);
    });

    expect(screen.getByRole('link-preview-image')).toHaveAttribute(
      'src',
      mockPreviewData.images[0].url,
    );

    expect(screen.getByText(mockPreviewData.site)).toBeInTheDocument();
    expect(screen.getByText(mockPreviewData.title)).toBeInTheDocument();
  });

  it('should not display link preview if there is no url', async () => {
    minProps.url = '';
    await act(async () => {
      render(<LinkPreview {...minProps} />);
    });

    expect(screen.queryByRole('link-preview')).not.toBeInTheDocument();
  });

  it('should use preview image if the preview type is photo', async () => {
    const previewImageUrl = 'hostsite.com/another-image.png';
    const previewData = {
      ...mockPreviewData,
      type: 'photo',
      image: {
        url: previewImageUrl,
      },
    };

    await act(async () => {
      render(<LinkPreview {...minProps} previewData={previewData} />);
    });

    expect(screen.getByRole('link-preview-image')).toHaveAttribute(
      'src',
      previewImageUrl,
    );
  });

  it('should show message if there is no preview data', async () => {
    await act(async () => {
      render(<LinkPreview {...minProps} previewData={null} />);
    });

    expect(screen.getByText(/No Preview Available/)).toBeInTheDocument();
  });

  it('should hide preview if there is an error when fetching data', async () => {
    await act(async () => {
      render(<LinkPreview {...minProps} error={true} />);
    });

    expect(screen.queryByRole('link-preview')).not.toBeInTheDocument();
  });
});
