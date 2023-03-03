/** @format */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import wait from 'waait';
import userEvent from '@testing-library/user-event';
import createProvider from '../../test-utils/createProvider';
import PostForm from '../../../src/components/PostForm';
import { CONTENT_CREATED } from '../../../src/graphql/content';
import { DateTime } from 'luxon';

const ownerId = 1;
const communityId = '2476';

describe('PostForm', () => {
  let minProps;
  let queryMocks;
  let feedItem;
  let mockOnSubmit;

  beforeEach(() => {
    const me = {
      _id: ownerId,
    };
    feedItem = {
      _id: '82ed8fb6-50df-4646-8eac-3abc12087dd7',
      title: 'Software Engineer - Caregiver Experience',
      body: 'testing',
      author: 'testing',
      category: 'Notice',
      assets: [],
      audiences: ['Resident'],
      tags: ['Integration Tests'],
      startDate: DateTime.local()
        .plus({ days: 1 })
        .toISO()
        .toLocaleString(DateTime.DATETIME_MED),
      endDate: DateTime.local()
        .plus({ days: 5 })
        .toISO()
        .toLocaleString(DateTime.DATETIME_MED),
    };
    mockOnSubmit = jest.fn();

    minProps = {
      me,
      feedItem,
      communityId,
      onSubmit: mockOnSubmit,
    };

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
  });

  describe('Add', () => {
    beforeEach(async () => {
      minProps.feedItem = undefined;

      const TestContextProvider = createProvider({
        apolloProps: {
          mocks: queryMocks,
        },
      });

      await act(async () => {
        render(<PostForm {...minProps} />, {
          wrapper: TestContextProvider,
        });

        await wait(0);
      });
    });

    it('should render the correct title', () => {
      const title = screen.getByText('New Post');
      expect(title).toBeDefined();
    });

    it('should only render the required input fields to be displayed by default', async () => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.queryByLabelText('Author')).not.toBeInTheDocument();
      expect(screen.getByText('Add File')).toBeInTheDocument();
      expect(screen.queryByLabelText('Description')).not.toBeInTheDocument();
    });

    it('should render the correct submit button', () => {
      expect(screen.getByText('Post')).toBeDefined();
    });

    it('should set audience to Resident App by default', () => {
      expect(screen.getByTestId('AP_postmodal-audience-Resident')).toHaveClass(
        'selected',
      );
    });

    it('should able to add a description', async () => {
      const inputValue = 'my description';
      await act(async () => {
        userEvent.click(screen.getByText('Add Description'));
      });
      expect(screen.getByLabelText('Description')).toBeInTheDocument();

      await act(async () => {
        await userEvent.type(
          await screen.findByLabelText('Description'),
          inputValue,
        );
      });
      expect(screen.getByLabelText('Description')).toHaveValue(inputValue);

      act(() => {
        userEvent.click(
          screen.getByTestId('AP_postmodal-description-clear-button'),
        );
      });
      expect(screen.queryByLabelText('Description')).not.toBeInTheDocument();
      expect(screen.getByText('Add Description')).toBeInTheDocument();
    });

    it('should be able to add an author', async () => {
      const inputValue = 'test';
      act(() => {
        userEvent.click(screen.getByText('Add Author'));
      });
      expect(screen.getByLabelText('Author')).toBeInTheDocument();

      await act(async () => {
        await userEvent.type(
          await screen.findByLabelText('Author'),
          inputValue,
        );
      });
      expect(screen.getByLabelText('Author')).toHaveValue(inputValue);

      act(() => {
        userEvent.click(screen.getByTestId('AP_postmodal-author-clear-button'));
      });
      expect(screen.queryByLabelText('Author')).not.toBeInTheDocument();
      expect(screen.getByText('Add Author')).toBeInTheDocument();
    });

    it('should display errors if the post submission is incomplete', async () => {
      await act(async () => {
        await userEvent.click(screen.getByText('Post'));
      });

      expect(screen.getByText('Please enter a title')).toBeInTheDocument();
      expect(screen.getByText('Please enter a tag')).toBeInTheDocument();
      expect(
        screen.queryByText('Please enter a description'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Edit', () => {
    beforeEach(async () => {
      const TestContextProvider = createProvider({
        apolloProps: {
          mocks: queryMocks,
        },
        routerProps: {
          initialentries: [
            `/feed/post/${feedItem._id}?communityId=${communityId}`,
          ],
        },
      });

      await act(async () => {
        render(<PostForm {...minProps} />, {
          wrapper: TestContextProvider,
        });

        await wait(0);
      });
    });

    it('should render the correct title', () => {
      expect(screen.getByText('Update Post')).toBeDefined();
    });

    it('should render the correct submit button', () => {
      expect(screen.getByText('Update Post')).toBeDefined();
    });

    it('should pre-populate form', async () => {
      await act(async () => {
        expect(screen.getByLabelText('Title').value).toBe(feedItem.title);

        expect(screen.getByLabelText('Author').value).toBe(feedItem.author);

        expect(screen.getByLabelText('Description').value).toBe(feedItem.body);

        expect(screen.getByLabelText('Category').value).toBe(feedItem.category);

        feedItem.tags.forEach((tag) => {
          expect(screen.getByText(tag)).toBeInTheDocument();
        });

        expect((await screen.findByLabelText('Post Start')).value).toBe(
          DateTime.fromISO(feedItem.startDate).toLocaleString(
            DateTime.DATETIME_MED,
          ),
        );

        expect((await screen.findByLabelText('Post End')).value).toBe(
          DateTime.fromISO(feedItem.endDate).toLocaleString(
            DateTime.DATETIME_MED,
          ),
        );

        feedItem.audiences.forEach((audience) => {
          expect(
            screen.getByTestId(`AP_postmodal-audience-${audience}`),
          ).toHaveClass('selected');
        });
      });
    });

    it('should be able to update a post', async () => {
      await act(async () => {
        await userEvent.click(await screen.findByText('Update Post'));
      });
    });
  });
});
