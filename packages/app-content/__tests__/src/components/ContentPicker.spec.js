/** @format */

import React from 'react';
import { screen, render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import createProvider from '../../test-utils/createProvider';
import wait from 'waait';
import { GET_CONTENTS } from '../../../src/graphql/content';
import ContentPicker from '../../../src/components/ContentPicker';

const mockContents = [
  {
    _id: '46b5a48f-4b41-43f4-987f-aabafd63ade9',
    name: 'Design #1',
    images: [
      'https://api-staging.k4connect.com/v3/content/download?filename=https://k4connect-document-staging.s3.amazonaws.com/jpgs/46b5a48f-4b41-43f4-987f-aabafd63ade9.jpg&redirect=true',
    ],
    url:
      'https://staging-k4connect-documents-adapter.s3.amazonaws.com/46b5a48f-4b41-43f4-987f-aabafd63ade9.pdf',
    __typename: 'Design',
  },
  {
    _id: '71cd781c-bc79-4e31-872c-0b890785a6d9',
    name: 'Design #2',
    images: [
      'https://api-staging.k4connect.com/v3/content/download?filename=https://k4connect-document-staging.s3.amazonaws.com/jpgs/71cd781c-bc79-4e31-872c-0b890785a6d9.jpg&redirect=true',
    ],
    url:
      'https://staging-k4connect-documents-adapter.s3.amazonaws.com/71cd781c-bc79-4e31-872c-0b890785a6d9.pdf',
    __typename: 'Design',
  },
];

const mockQueries = [
  {
    request: {
      query: GET_CONTENTS,
      variables: {
        communityId: '2476',
        page: {
          limit: 27,
          field: 'Edited',
          order: 'Desc',
        },
        filters: {
          search: null,
          docType: 'design',
        },
      },
    },
    result: {
      data: {
        community: {
          contents: mockContents,
          __typename: 'Community',
        },
      },
    },
  },
  {
    request: {
      query: GET_CONTENTS,
      variables: {
        communityId: '2476',
        page: {
          limit: 27,
          field: 'Edited',
          order: 'Desc',
        },
        filters: {
          search: 'no-content-query',
          docType: 'design',
        },
      },
    },
    result: {
      data: {
        community: {
          contents: [],
          __typename: 'Community',
        },
      },
    },
  },
  {
    request: {
      query: GET_CONTENTS,
      variables: {
        communityId: '2476',
        page: {
          limit: 27,
          field: 'Edited',
          order: 'Desc',
        },
        filters: {
          search: 'error-query',
          docType: 'design',
        },
      },
    },
    error: new Error('wah wah'),
  },
];

describe('ContentPicker', () => {
  let minProps;
  let mockSetDesignPickerOpen;
  let mockOnClick;

  beforeEach(async () => {
    mockSetDesignPickerOpen = jest.fn();
    mockOnClick = jest.fn();

    minProps = {
      setDesignPickerOpen: mockSetDesignPickerOpen,
      onClick: mockOnClick,
    };

    const TestContextProvider = createProvider({
      apolloProps: {
        mocks: mockQueries,
      },
    });

    await act(async () => {
      render(<ContentPicker {...minProps} />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });
  });

  it('should show loading icon when fetching contents', async () => {
    const TestContextProvider = createProvider({
      apolloProps: {
        mocks: mockQueries,
      },
    });

    await act(async () => {
      render(<ContentPicker {...minProps} />, {
        wrapper: TestContextProvider,
      });
      expect(await screen.getAllByRole('progressbar')[0]).toBeInTheDocument();
    });
  });

  it('should display no results found message if no content returns from search', async () => {
    await act(async () => {
      await userEvent.type(
        await screen.findByPlaceholderText('Search by name'),
        'no-content-query',
      );
    });

    expect(await screen.findByText('No results found')).toBeInTheDocument();
  });

  it('should display error message if query returns error', async () => {
    await act(async () => {
      await userEvent.type(
        await screen.findByPlaceholderText('Search by name'),
        'error-query',
      );
    });

    expect(await screen.findByRole('errorimage')).toBeInTheDocument();
  });

  it('should hide design picker when click cancel', () => {
    act(() => {
      userEvent.click(screen.getByText('CANCEL'));
    });

    expect(mockSetDesignPickerOpen).toHaveBeenCalled();
  });
});
