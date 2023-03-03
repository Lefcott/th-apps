/** @format */

import React from 'react';
import { screen, render, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import createProvider from '../../test-utils/createProvider';
import wait from 'waait';
import { GET_FEED, END_POST } from '../../../src/graphql/feed';
import FeedContainer from '../../../src/components/FeedContainer';
import makePostArray from '../../test-utils/createPostArray';
import flushPromises from 'flush-promises';

const communityId = '2476';
const currentDate = new Date();

describe('FeedContainer', () => {
  let minProps;
  const RealDate = Date;
  beforeEach(async () => {
    global.Date.now = jest.fn(() => new Date(currentDate).getTime());
    const activePosts = makePostArray(10, 'active');

    const mocks = [
      {
        request: {
          query: GET_FEED,
          variables: {
            communityId,
            page: {
              limit: 10,
              page: 0,
            },
            filters: {
              audiences: ['ResidentVoice', 'Resident', 'Family'],
              status: 'Archived',
              anchoredAt: new Date(Date.now()).toISOString(),
            },
          },
        },
        result: {
          data: {
            community: {
              feed: {
                posts: [],
                pageInfo: {
                  currentPage: 0,
                  total: 0,
                  hasNextPage: 0,
                  lastPage: 0,
                  __typename: 'PageInfo',
                },
                __typename: 'FeedPayload',
              },
              __typename: 'Community',
            },
          },
        },
      },
      {
        request: {
          query: GET_FEED,
          variables: {
            communityId,
            page: {
              limit: 10,
              page: 0,
            },
            filters: {
              search: 'noresults',
              audiences: ['ResidentVoice', 'Resident', 'Family'],
              status: 'Active',
              anchoredAt: new Date(Date.now()).toISOString(),
            },
          },
        },
        result: {
          data: {
            community: {
              feed: {
                posts: [],
                pageInfo: {
                  currentPage: 0,
                  total: 0,
                  hasNextPage: 0,
                  lastPage: 0,
                  __typename: 'PageInfo',
                },
                __typename: 'FeedPayload',
              },
              __typename: 'Community',
            },
          },
        },
      },
      {
        request: {
          query: GET_FEED,
          variables: {
            communityId,
            page: {
              limit: 10,
              page: 0,
            },
            filters: {
              audiences: ['ResidentVoice', 'Resident', 'Family'],
              status: 'Active',
              anchoredAt: new Date(Date.now()).toISOString(),
            },
          },
        },
        result: {
          data: {
            community: {
              feed: {
                posts: activePosts,
                pageInfo: {
                  hasNextPage: true,
                  currentPage: 0,
                  lastPage: 1,
                  total: 14,
                  __typename: 'PageInfo',
                },
                __typename: 'FeedPayload',
              },
              __typename: 'Community',
            },
          },
        },
      },
      // this is for going back to the query
      {
        request: {
          query: GET_FEED,
          variables: {
            communityId,
            page: {
              limit: 10,
              page: 0,
            },
            filters: {
              audiences: ['ResidentVoice', 'Resident', 'Family'],
              status: 'Active',
              anchoredAt: new Date(Date.now()).toISOString(),
            },
          },
        },
        result: {
          data: {
            community: {
              feed: {
                posts: makePostArray(10, 'active'),
                pageInfo: {
                  hasNextPage: true,
                  currentPage: 0,
                  lastPage: 1,
                  total: 14,
                  __typename: 'PageInfo',
                },
                __typename: 'FeedPayload',
              },
              __typename: 'Community',
            },
          },
        },
      },
      {
        request: {
          query: GET_FEED,
          variables: {
            communityId,
            page: {
              limit: 10,
              page: 1,
            },
            filters: {
              audiences: ['ResidentVoice', 'Resident', 'Family'],
              status: 'Active',
              anchoredAt: new Date(Date.now()).toISOString(),
            },
          },
        },
        result: {
          data: {
            community: {
              feed: {
                posts: makePostArray(4, 'active', 1),
                pageInfo: {
                  hasNextPage: false,
                  currentPage: 1,
                  lastPage: 1,
                  total: 14,
                  __typename: 'PageInfo',
                },
                __typename: 'FeedPayload',
              },
              __typename: 'Community',
            },
          },
        },
      },
      {
        request: {
          query: END_POST,
          variables: {
            communityId,
            postId: activePosts[0]._id,
          },
        },
        result: {
          data: {
            community: {
              post: {
                end: {
                  _id: activePosts[0]._id,
                  __typename: 'Post',
                },
                __typename: 'Post_',
              },
              __typename: 'Community_',
            },
          },
        },
      },
    ];

    const TestProvider = createProvider({
      apolloProps: {
        mocks,
      },
      routerProps: {
        initialentries: [`feed?communityId=${communityId}`],
      },
    });

    await act(async () => {
      render(<FeedContainer {...minProps} />, {
        wrapper: TestProvider,
      });
      await wait(0);
    });
  });

  afterEach(() => {
    global.Date = RealDate;
  });

  it('should render itself, the feed table, and the feed toolbar', async () => {
    expect(await screen.findByTestId('AP_feed-container')).toBeInTheDocument();
    expect(await screen.findByTestId('AP_feed-table')).toBeInTheDocument();
    expect(await screen.findByTestId('AP_feed-toolbar')).toBeInTheDocument();

    const tableBody = await screen.findByTestId('AP_feed-table-body');

    expect(tableBody.children.length).toBe(10);
    expect(tableBody.firstChild.classList.contains('AP_feedItem')).toBe(true);
  });

  it('Should fetch next page of data if next page is clicked', async () => {
    const nextPage = await screen.findByTestId(
      'AP_PaginationActions-IconButton-NextPage',
    );
    await act(async () => {
      await userEvent.click(nextPage);
    });

    // check table body for 4 items since we paged
    const tableBody = await screen.findByTestId('AP_feed-table-body');
    expect(tableBody.children.length).toBe(4);
    expect(tableBody.firstChild.classList.contains('AP_feedItem')).toBe(true);
    expect(
      await screen.findByTestId('AP_PaginationActions-IconButton-NextPage'),
    ).toHaveAttribute('disabled');

    // go back to first page and check that we're back to normal
    await act(async () => {
      await userEvent.click(
        await screen.findByTestId('AP_PaginationActions-IconButton-PrevPage'),
      );
    });

    await wait(100);
    const lastTableBody = await screen.findByTestId('AP_feed-table-body');
    expect(lastTableBody.children.length).toBe(10);
    expect(
      await screen.findByTestId('AP_PaginationActions-IconButton-NextPage'),
    ).not.toHaveAttribute('disabled');
  });

  it('respond to search term update and rerender', async () => {
    await act(async () => {
      await userEvent.type(
        await screen.findByTestId('AP_nametag-search-input'),
        'noresults',
      );
      await wait(600);
    });
    expect(
      await screen.getByTestId('AP_feedItem-noResults'),
    ).toBeInTheDocument();
  });

  it('Changing status filter should rerender with results', async () => {
    const endStatusButton = await screen.findByTestId('AP_view-ended');

    await act(async () => {
      userEvent.click(endStatusButton);
    });

    await wait(100);
    expect(
      await screen.findByTestId('AP_feedItem-noPosts'),
    ).toBeInTheDocument();
  });

  it('should be able to end post', async () => {
    await act(async () => {
      userEvent.click(screen.getAllByTestId('AP_feedItem-more')[0]);
      userEvent.click(screen.getAllByText('End Post')[0]);

      const { findByText } = within(await screen.findByRole('dialog'));
      userEvent.click(await findByText(/end post$/i));

      await flushPromises();
    });
  });
});
