/** @format */
import React from 'react';
import {
  render,
  screen,
  act,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import createProvider from '../../test-utils/createProvider';
import PostModal from '../../../src/components/PostModal';
import wait from 'waait';
import {
  GET_FEED_ITEM,
  PUBLISH_TO_FEED,
  UPDATE_POST,
  UPDATE_POST_ASSETS,
} from '../../../src/graphql/feed';
import { CONTENT_CREATED, CREATE_UPLOAD } from '../../../src/graphql/content';
import { showToast } from '@teamhub/toast';
import { useHistory } from 'react-router-dom';
import flushPromises from 'flush-promises';
import { DateTime } from 'luxon';
import useFetch from 'use-http';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));

const mockPreviewData = {
  card: 'google-logo.jpeg',
  title: 'Google site Duh',
  site: '@Google',
  images: [
    {
      url: 'https://google.com',
    },
  ],
  protocol: 'twitter_card',
};

jest.mock('use-http', () => jest.fn());
const mockPost = jest.fn().mockImplementation(() => mockPreviewData);
const fetchOptions = {
  loading: false,
  post: mockPost,
  response: {
    ok: true,
  },
};

useFetch.mockImplementation(() => fetchOptions);
const ownerId = 1;
const communityId = '2476';
const feedItemId = '82ed8fb6-50df-4646-8eac-3abc12087dd7';

describe('PostModal', () => {
  let minProps;
  let TestContextProvider;
  let queryMocks;
  let startDateString;
  let endDateString;
  let mockHistory;
  let ogLocal;

  beforeAll(() => {
    ogLocal = DateTime.local;
  });

  afterEach(() => {
    DateTime.local = ogLocal;
  });

  beforeEach(() => {
    minProps = {
      me: {
        _id: ownerId,
      },
      match: {
        params: { id: feedItemId },
      },
    };

    startDateString = DateTime.local()
      .plus({ days: 2 })
      .toISO()
      .toLocaleString(DateTime.DATETIME_MED);

    endDateString = DateTime.local()
      .plus({ days: 5 })
      .toISO()
      .toLocaleString(DateTime.DATETIME_MED);

    queryMocks = [
      {
        request: {
          query: CONTENT_CREATED,
          variables: {
            communityId,
            docType: ['document', 'photo'],
            owner: ownerId,
          },
        },
        result: {
          data: null,
        },
      },
    ];

    mockHistory = {
      push: jest.fn(),
    };
    useHistory.mockReturnValue(mockHistory);
  });

  describe('Add', () => {
    let mockLocal;
    let newPostData;
    let uploadFiles;

    beforeEach(async () => {
      minProps.match.params.id = null;

      mockLocal = () => ({
        toISO: () => ({
          toLocaleString: () => startDateString,
        }),
        plus: () => ({
          toISO: () => ({
            toLocaleString: () => startDateString,
          }),
        }),
      });

      uploadFiles = [
        new File(['( ͡° ͜ʖ ͡°)'], 'doc.pdf', {
          type: 'application/pdf',
        }),
      ];

      const pdfUploadRequest = {
        request: {
          query: CREATE_UPLOAD,
          variables: {
            communityId,
            files: [
              {
                name: 'doc.pdf',
                type: 'application/pdf',
              },
            ],
          },
        },
        result: {
          data: {
            community: {
              getUploadUrl: [
                {
                  _id: 'new-upload-id',
                  name: 'doc.pdf',
                  url: 'https://aws-bucket.com/doc.pdf',
                  __typename: 'Document',
                },
              ],
              __typename: 'Community',
            },
          },
        },
      };

      queryMocks.push(pdfUploadRequest);

      newPostData = {
        category: 'Video',
        author: 'Mickey D',
        audiences: ['Resident'],
        title: 'New Post',
        body: 'New Description',
        tags: ['New Tag'],
        url: 'https://google.com',
        assets: [],
        schedule: {
          startDate: startDateString,
          endDate: endDateString,
        },
      };

      const basicPostRequest = {
        request: {
          query: PUBLISH_TO_FEED,
          variables: {
            communityId,
            input: {
              category: 'Notice',
              audiences: newPostData.audiences,
              title: newPostData.title,
              body: null,
              tags: newPostData.tags,
              url: null,
              assets: [],
              schedule: {
                startDate: startDateString,
              },
            },
          },
        },
        result: {
          data: {
            community: {
              publish: {
                _id: 'random-hash',
                title: newPostData.title,
                body: '',
                author: newPostData.author,
                assets: [],
                category: 'Notice',
                audiences: newPostData.audiences,
                tags: newPostData.tags,
                startDate: startDateString,
                endDate: null,
                __typename: 'Post',
              },
              __typename: 'Community_',
            },
          },
        },
      };
      queryMocks.push(basicPostRequest);

      const complexPostRequest = {
        request: {
          query: PUBLISH_TO_FEED,
          variables: {
            communityId,
            input: {
              category: newPostData.category,
              audiences: newPostData.audiences,
              title: newPostData.title,
              body: newPostData.body,
              tags: newPostData.tags,
              url: newPostData.url,
              author: newPostData.author,
              assets: newPostData.assets,
              schedule: {
                startDate: startDateString,
              },
            },
          },
        },
        result: {
          data: {
            community: {
              publish: {
                _id: 'random-hash',
                title: newPostData.title,
                body: newPostData.body,
                author: newPostData.author,
                category: newPostData.category,
                audiences: newPostData.audiences,
                tags: newPostData.tags,
                startDate: startDateString,
                endDate: null,
                assets: [],
                __typename: 'Post',
              },
              __typename: 'Community_',
            },
          },
        },
      };
      queryMocks.push(complexPostRequest);

      TestContextProvider = createProvider({
        apolloProps: {
          mocks: queryMocks,
        },
        routerProps: {
          initialentries: [`/feed/post?communityId=${communityId}`],
        },
      });
    });

    it('should redirect to feed container when canceled', async () => {
      await act(async () => {
        render(<PostModal {...minProps} />, {
          wrapper: TestContextProvider,
        });
        await wait(0);
      });

      act(() => userEvent.click(screen.getByText('Cancel')));
      waitForElementToBeRemoved(() => screen.getByTestId('AP_postmodal'));
    });

    it('should not be able to submit a blank form', async () => {
      await act(async () => {
        render(<PostModal {...minProps} />, {
          wrapper: TestContextProvider,
        });
        await wait(0);
      });

      await act(async () => {
        await userEvent.click(screen.getByText('Post'));
      });

      expect(screen.getByText('Title').getAttribute('class')).toMatch(/error/);
      expect(screen.getAllByText('Tags')[0].getAttribute('class')).toMatch(
        /error/
      );
    });

    it('should set default post start and post end', async () => {
      await act(async () => {
        render(<PostModal {...minProps} />, {
          wrapper: TestContextProvider,
        });
        await wait(0);
      });

      expect(screen.getByDisplayValue(/Immediately/)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/Never/)).toBeInTheDocument();
    });

    it('should be able to submit basic form', async () => {
      DateTime.local = mockLocal;

      await act(async () => {
        render(<PostModal {...minProps} />, {
          wrapper: TestContextProvider,
        });
        await wait(0);
      });

      await act(async () => {
        await userEvent.type(
          await screen.findByLabelText('Title'),
          newPostData.title
        );

        await userEvent.type(
          await screen.findByLabelText('Tags'),
          newPostData.tags[0]
        );

        await userEvent.click(
          await screen.findByText(`Create "${newPostData.tags[0]}" tag`)
        );

        await userEvent.click(screen.getByText('Post'));
        await flushPromises();
      });

      expect(showToast).toHaveBeenCalled();
      showToast.mock.calls[0][1].onEntered();
      expect(mockHistory.push).toHaveBeenCalledWith({
        pathname: '/feed',
        search: `?communityId=${communityId}`,
      });
    });

    it('should be able to submit complex form', async () => {
      DateTime.local = () => ({
        toISO: () => ({
          toLocaleString: () => startDateString,
        }),
        plus: () => ({
          toISO: () => ({
            toLocaleString: () => startDateString,
          }),
        }),
      });

      await act(async () => {
        render(<PostModal {...minProps} />, {
          wrapper: TestContextProvider,
        });
        await wait(0);
      });

      await act(async () => {
        await userEvent.type(
          await screen.findByLabelText('Title'),
          newPostData.title
        );

        await userEvent.click(await screen.findByText('Add Author'));

        await userEvent.type(
          await screen.findByLabelText('Author'),
          newPostData.author
        );

        await userEvent.click(await screen.findByText('Add Description'));

        await userEvent.type(
          await screen.findByLabelText('Description'),
          newPostData.body
        );

        await userEvent.click(await screen.findByText('Add File'));

        const input = await screen.findByTestId('AP_postmodal-dropzonearea');
        Object.defineProperty(input, 'files', {
          value: uploadFiles,
        });

        await fireEvent.change(input);
        await wait(0);

        await screen.findByRole('upload-item-placeholder');

        await userEvent.click(await screen.findByText('Add Link'));

        await userEvent.type(
          await screen.findByLabelText('Link'),
          newPostData.url
        );
        await screen.findByRole('link-preview-title');

        await userEvent.click(await screen.findByLabelText('Category'));

        await userEvent.click(await screen.findByText('Video'));

        await userEvent.type(
          await screen.findByLabelText('Tags'),
          newPostData.tags[0]
        );

        await userEvent.click(
          await screen.findByText(`Create "${newPostData.tags[0]}" tag`)
        );

        await userEvent.click(screen.getByText('Post'));
        await flushPromises(); // prevent error from stalling testing
      });
      await wait(1000);
      expect(showToast).toHaveBeenCalled();
      showToast.mock.calls[0][1].onEntered();
      expect(mockHistory.push).toHaveBeenCalledWith({
        pathname: '/feed',
        search: `?communityId=${communityId}`,
      });
    });
  });

  describe('Edit', () => {
    let editData;

    beforeEach(() => {
      editData = {
        title: 'Edited Title',
        body: 'Edited Description',
        author: 'Edited Author',
        category: 'Notice',
        url: 'https://youtube.com',
        audiences: ['Family'],
        tags: ['Edit Test'],
      };

      const postAssets = [
        {
          contentId: '46b5a48f-4b41-43f4-987f-aabafd63ade9',
          name: 'doc',
          contentId: '46b5a48f-4b41-43f4-987f-aabafd63ade9',
          type: 'Pdf',
          images: [
            'https://api-staging.k4connect.com/v3/content/download?filename=https://k4connect-document-staging.s3.amazonaws.com/jpgs/46b5a48f-4b41-43f4-987f-aabafd63ade9.jpg&redirect=true',
          ],
          url:
            'https://staging-k4connect-documents-adapter.s3.amazonaws.com/46b5a48f-4b41-43f4-987f-aabafd63ade9.pdf',
          preview: null,
          __typename: 'Document',
          details: {},
        },
        {
          contentId: '46b5a48f-4b41-43f4-987f-aabafd63ade9',
          name: 'Design #1',
          contentId: '46b5a48f-4b41-43f4-987f-aabafd63ade9',
          images: [
            'https://api-staging.k4connect.com/v3/content/download?filename=https://k4connect-document-staging.s3.amazonaws.com/jpgs/46b5a48f-4b41-43f4-987f-aabafd63ade9.jpg&redirect=true',
          ],
          url:
            'https://staging-k4connect-documents-adapter.s3.amazonaws.com/46b5a48f-4b41-43f4-987f-aabafd63ade9.design',
          type: 'Pdf',
          details: {},
          preview: '',
          __typename: 'Design',
        },
        {
          contentId: null,
          name: 'https://www.google.com/',
          type: 'Web',
          contentId: null,
          url: 'https://www.google.com/',
          details: {
            message: 'No data available',
            protocol: 'none',
          },
          preview: null,
          __typename: 'Asset',
        },
      ];

      const feedItem = {
        community: {
          feedItem: {
            _id: feedItemId,
            title: 'Software Engineer - Caregiver Experience',
            body: 'testing',
            author: 'testing',
            category: 'Notice',
            audiences: ['Resident'],
            url: 'https://google.com',
            assets: postAssets,
            tags: ['Integration Tests'],
            startDate: startDateString,
            endDate: endDateString,
            __typename: 'FeedPayload',
          },
          __typename: 'Community',
        },
      };
      const feedItemData = feedItem.community.feedItem;

      const getEditItemRequest = {
        request: {
          query: GET_FEED_ITEM,
          variables: {
            communityId,
            feedItemId,
          },
        },
        result: {
          data: feedItem,
        },
      };
      queryMocks.push(getEditItemRequest);

      const editPostRequest = {
        request: {
          query: UPDATE_POST,
          variables: {
            communityId,
            postId: feedItemId,
            editPostInput: {
              title: editData.title,
              body: editData.body,
              author: editData.author,
              audiences: [...feedItemData.audiences, ...editData.audiences],
              tags: [...feedItemData.tags, ...editData.tags],
              startDate: feedItemData.startDate,
              endDate: feedItemData.endDate,
            },
          },
        },
        result: {
          data: {
            community: {
              post: {
                edit: {
                  _id: 'random-hash',
                  title: editData.title,
                  body: editData.body,
                  author: editData.author,
                  category: editData.category,
                  audiences: [...feedItemData.audiences, ...editData.audiences],
                  tags: [...feedItemData.tags, ...editData.tags],
                  startDate: feedItemData.startDate,
                  endDate: feedItemData.endDate,
                  assets: feedItemData.assets,
                  _createdAt: null,
                  _updatedAt: null,
                  _updatedBy: null,
                  recurrence: null,
                  __typename: 'Post',
                },
                __typename: 'Post_',
              },
              __typename: 'Community_',
            },
          },
        },
      };

      queryMocks.push(editPostRequest);

      const updatePostAssetsRequest = {
        request: {
          query: UPDATE_POST_ASSETS,
          variables: {
            communityId,
            postId: feedItemId,
            editAssetsInput: {
              url: editData.url,
              assets: postAssets
                .filter((x) => x.contentId)
                .map((asset) => ({
                  type: asset.type,
                  name: asset.name,
                  url: asset.url,
                  contentId: asset.contentId,
                  details: asset.details,
                })),
            },
          },
        },
        result: {
          data: {
            community: {
              post: {
                editAssets: {
                  _createdAt: null,
                  _updatedAt: null,
                  _updatedBy: null,
                  _id: 'random-hash',
                  category: editData.category,
                  title: editData.title,
                  body: editData.body,
                  author: editData.author,
                  audiences: [...feedItemData.audiences, ...editData.audiences],
                  tags: [...feedItemData.tags, ...editData.tags],
                  startDate: feedItemData.startDate,
                  endDate: feedItemData.endDate,
                  assets: feedItemData.assets,
                  recurrence: null,
                  __typename: 'Post',
                },
                __typename: 'Post_',
              },
              __typename: 'Community_',
            },
          },
        },
      };

      queryMocks.push(updatePostAssetsRequest);

      TestContextProvider = createProvider({
        apolloProps: {
          mocks: queryMocks,
        },
        routerProps: {
          initialentries: [
            `/feed/post/${feedItemId}?communityId=${communityId}`,
          ],
        },
      });
    });

    it('should be able to edit post', async () => {
      await act(async () => {
        render(<PostModal {...minProps} />, {
          wrapper: TestContextProvider,
        });
        await wait(0);
      });

      await act(async () => {
        await userEvent.clear(await screen.findByLabelText('Title'));
        await userEvent.type(
          await screen.findByLabelText('Title'),
          editData.title
        );

        await userEvent.click(
          await screen.findByTestId('AP_postmodal-author-clear-button')
        );
        await userEvent.click(await screen.findByText('Add Author'));
        await userEvent.clear(await screen.findByLabelText('Author'));
        await userEvent.type(
          await screen.findByLabelText('Author'),
          editData.author
        );

        await userEvent.click(
          await screen.findByTestId('AP_postmodal-description-clear-button')
        );
        await userEvent.click(await screen.findByText('Add Description'));
        await userEvent.clear(await screen.findByLabelText('Description'));
        await userEvent.type(
          await screen.findByLabelText('Description'),
          editData.body
        );

        await screen.findByText('doc.pdf');

        await userEvent.click(
          await screen.findByTestId('AP_postmodal-url-clear-button')
        );
        await userEvent.click(await screen.findByText('Add Link'));
        await userEvent.type(
          await screen.findByLabelText('Link'),
          editData.url
        );

        await screen.findByRole('link-preview-title');

        expect(await screen.findByLabelText('Category')).toBeDisabled();

        await userEvent.type(
          await screen.findByLabelText('Tags'),
          editData.tags[0]
        );
        await userEvent.click(
          await screen.findByText(`Create "${editData.tags[0]}" tag`)
        );

        await userEvent.click(
          screen.getByTestId(`AP_postmodal-audience-${editData.audiences[0]}`)
        );

        await userEvent.click(screen.getByText('Update Post'));
        await flushPromises(); // prevent error from stalling testing
      });
      await flushPromises();
      await wait(0);
      expect(showToast).toHaveBeenCalled();
      showToast.mock.calls[0][1].onEntered();
      expect(mockHistory.push).toHaveBeenCalledWith({
        pathname: '/feed',
        search: `?communityId=${communityId}`,
      });
    });
  });
});
