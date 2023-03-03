import React from 'react';
import DeleteModal from '../../src/components/DeleteModal';
import createTestProvider from '../utils/createTestProvider';
import { GET_POSTS_BY_CONTENT_ID } from '../../src/graphql/feed';
import { DELETE_CONTENT } from '../../src/graphql/content';
import {
  render,
  screen,
  act,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react';
import wait from 'waait';
import userEvent from '@testing-library/user-event';

const COMMUNITY_ID = '2476';

const mockProps = {
  design: {
    contentId: 'be2ca72b-7072-4422-8bd4-24b9d6c4b440',
    docType: 'design',
    refetch: jest.fn(),
    closeDropdown: jest.fn(),
  },
  pdf: {
    contentId: 'c25bc1ff-d2e8-4571-ac09-e88d92ec4e4b',
    docType: 'document',
    refetch: jest.fn(),
    closeDropdown: jest.fn(),
  },
  photo: {
    contentId: '0e1b86ca-6988-4003-b38b-39d9b58ab0fe',
    docType: 'photo',
    refetch: jest.fn(),
    closeDropdown: jest.fn(),
  },
};

// store all apollo props here
const apolloMocks = [
  {
    request: {
      query: GET_POSTS_BY_CONTENT_ID,
      variables: {
        communityId: '2476',
        contentIds: [mockProps.design.contentId],
      },
    },
    result: {
      data: {
        community: {
          __typename: 'Community',
          feedItemsByContentId: [
            {
              _id: 'a992809e-0c0d-420f-b64c-9348c0e53e38',
              title: 'Test Post With Design',
              startDate: '2020-07-29T18:55:15.088Z',
              audiences: ['Family', 'Resident'],
              __typename: 'Community',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: GET_POSTS_BY_CONTENT_ID,
      variables: {
        communityId: '2476',
        contentIds: [mockProps.photo.contentId],
      },
    },
    result: {
      data: {
        community: {
          __typename: 'Community',
          feedItemsByContentId: [
            {
              _id: 'a992809e-0c0d-420f-b64c-9348c0e53e38',
              title: 'Test Post With Photo',
              startDate: '2020-07-29T18:55:15.088Z',
              audiences: ['Family', 'Resident'],
              __typename: 'Post',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: GET_POSTS_BY_CONTENT_ID,
      variables: {
        communityId: '2476',
        contentIds: [mockProps.pdf.contentId],
      },
    },
    result: {
      data: {
        community: {
          __typename: 'Community',
          feedItemsByContentId: [],
        },
      },
    },
  },
  {
    request: {
      query: DELETE_CONTENT,
      variables: {
        communityId: '2476',
        contentId: mockProps.photo.contentId,
      },
    },
    result: {
      data: {
        community: {
          __typename: 'Community',
          content: {
            __typename: 'Content_',
            delete: {
              __typename: 'Content',
              _id: mockProps.photo.contentId,
            },
          },
        },
      },
    },
  },
];

describe('Delete Content Modal', () => {
  let TestProvider;
  beforeEach(() => {
    TestProvider = createTestProvider({ apolloProps: { mocks: apolloMocks } });
  });

  it('Should render posts that a design is attached to when opening', async () => {
    await act(async () => {
      render(<DeleteModal {...mockProps.design} />, { wrapper: TestProvider });
      await wait(0);
    });
    const button = await screen.getByTestId('CL_card-menuList-delete');
    expect(button).toBeInTheDocument();
    userEvent.click(screen.getByText('Delete'));
    await wait(0);

    const title = screen.getByText('Delete Design from library and posts?');
    expect(title).toBeInTheDocument();
    const tableBody = screen.getByTestId('CL-delete-modal-table-body');
    // we should have a single post
    expect(tableBody.children.length).toBe(1);
    // the cells are displaying properly
    expect(screen.getByText('Test Post With Design')).toBeInTheDocument();
    expect(screen.getByText('Jul 29, 2020')).toBeInTheDocument();
    expect(screen.getByText('Res App, F&F App')).toBeInTheDocument();

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    await act(async () =>
      userEvent.click(screen.getByTestId('CL-delete-modal-cancel'))
    );
  });

  it("should render only text if there's no attached posts", async () => {
    await act(async () => {
      render(<DeleteModal {...mockProps.pdf} />, { wrapper: TestProvider });
      await wait(0);
    });
    const button = await screen.getByTestId('CL_card-menuList-delete');
    expect(button).toBeInTheDocument();
    userEvent.click(screen.getByText('Delete'));
    await wait(0);

    expect(screen.getByText('Delete PDF from library?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Deleting permanently removes this PDF from the Content Library'
      )
    ).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByTestId('CL-delete-modal-cancel'));
      await wait(0);
    });
    expect(mockProps.pdf.closeDropdown).toHaveBeenCalled();
    waitForElementToBeRemoved(() => screen.getByTestId('CL-delete-modal'));
  });

  it('Clicking delete should remove the modal and call refetch and closeDropdown', async () => {
    await act(async () => {
      render(<DeleteModal {...mockProps.photo} />, { wrapper: TestProvider });
      await wait(0);
    });
    const button = await screen.getByTestId('CL_card-menuList-delete');
    expect(button).toBeInTheDocument();
    userEvent.click(screen.getByText('Delete'));
    await wait(0);

    await act(async () =>
      userEvent.click(screen.getByTestId('CL-delete-modal-submit'))
    );
    await wait(10);
    expect(mockProps.photo.closeDropdown).toHaveBeenCalled();
    expect(mockProps.photo.refetch.mock.calls.length).toBe(1);
  });
});
