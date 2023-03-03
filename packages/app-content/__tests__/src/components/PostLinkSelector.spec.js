/** @format */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import wait from 'waait';
import userEvent from '@testing-library/user-event';
import PostLinkSelector from '../../../src/components/PostLinkSelector';

jest.mock('use-http', () =>
  jest.fn().mockImplementation(() => ({
    loading: false,
    post: jest.fn().mockImplementation(() => mockPreviewData),
    response: {
      ok: true,
    },
  })),
);

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

describe('PostLinkSelector', () => {
  let mockData = {
    data: {
      _id: 'f8bbf24f-f754-4fda-bc76-16f285849163',
      title: 'Checkout this link',
      body: 'Looking to hike the AT season 2020? Think again!',
      category: 'Notice',
      audiences: ['Resident'],
      tags: ['test'],
      assets: [],
      startDate: '2020-06-12T20:17:50.504+00:00',
      endDate: null,
      __typename: 'Post',
      url: '',
    },
    error: false,
    helperText: '',
  };

  let mockOnChange;

  beforeEach(() => {
    mockOnChange = jest.fn();
  });

  describe('when I render with NO existing props', () => {
    beforeEach(async () => {
      await act(async () => {
        render(
          <PostLinkSelector data={mockData.data} onChange={mockOnChange} />,
        );
        await wait(0);
      });
    });

    it('should render without exploding without url and the addlink button', async () => {
      let showLinkInput = await screen.getByTestId(
        'AP_postmodal-showLinkInput',
      );
      expect(showLinkInput).toBeDefined();
    });

    it('should be able to add link', async () => {
      const url = 'https://google.com';
      await act(async () => {
        userEvent.click(screen.getByTestId('AP_postmodal-showLinkInput'));

        userEvent.type(await screen.findByLabelText('Link'), url);
      });

      expect(screen.getByLabelText('Link')).toHaveValue(url);

      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('When I render with existing props', () => {
    let webAsset, domish;

    beforeEach(async () => {
      webAsset = {
        name: 'https://www.nps.gov/appa/index.htm',
        type: 'Web',
        url: 'https://www.nps.gov/appa/index.htm',
        details: {
          url: 'https://www.nps.gov/appa/index.htm',
          type: 'website',
          title:
            'Appalachian National Scenic Trail (U.S. National Park Service)',
          images: [
            {
              url:
                'https://www.nps.gov/common/uploads/banner_image/ncr/homepage/2B375594-1DD8-B71B-0BC86B7829AAFFC8.jpg',
              width: 2400,
              height: 700,
            },
          ],
          protocol: 'open_graph',
        },
        preview: null,
        __typename: 'Asset',
      };

      mockData.data.assets.push(webAsset);
      mockData.data.url = 'https://www.nps.gov/appa/index.htm';

      await act(async () => {
        let { container } = render(
          <PostLinkSelector data={mockData.data} onChange={mockOnChange} />,
        );
        domish = container;
        await wait(2000);
      });
    });

    it('should render without exploding without url and the addlink button', async () => {
      let urlInput = domish.querySelector(`input[name='url']`);
      expect(urlInput).toBeDefined();
      expect(urlInput.value).toEqual(mockData.data.url);
    });

    it('should hide the input field when closed', async () => {
      await act(async () => {
        userEvent.click(
          await screen.findByTestId('AP_postmodal-url-clear-button'),
        );
      });

      expect(screen.queryByLabelText('Link')).not.toBeInTheDocument();

      await act(async () => {
        userEvent.click(
          await screen.findByTestId('AP_postmodal-showLinkInput'),
        );
      });

      expect(screen.queryByLabelText('Link')).toHaveValue('');
    });
  });
});
