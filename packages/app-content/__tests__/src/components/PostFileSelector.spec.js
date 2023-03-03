/** @format */

import React from 'react';
import {
  screen,
  render,
  act,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import wait from 'waait';
import PostFileSelector from '../../../src/components/PostFileSelector';
import {
  CREATE_UPLOAD,
  CONTENT_CREATED,
  GET_CONTENTS,
  GET_CONTENT,
} from '../../../src/graphql/content';
import createProvider from '../../test-utils/createProvider';
import { DateTime } from 'luxon';
import { useLocation } from 'react-router-dom';

jest.setTimeout(30 * 1000);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

const communityId = '2476';
const feedItemId = '82ed8fb6-50df-4646-8eac-3abc12087dd7';
const meId = '1';
const uploadContentUserId = '2';
const contentId = '62660a8e-b4a8-4379-887f-39965f862d4f';
const uploadFile = {
  name: 'chucknorris.png',
  type: 'image/png',
};

const mockContentCreated = {
  _id: '62660a8e-b4a8-4379-887f-39965f862d4f',
  __typename: 'Document',
  created: '2020-06-22T17:11:46.000+00:00',
  name: 'summermenu_2020',
  docType: 'document',
  url:
    'https://api-staging.k4connect.com/v3/content/download?filename=https://k4connect-document-staging.s3.amazonaws.com/pdfs/62660a8e-b4a8-4379-887f-39965f862d4f.pdf&redirect=true',
  images: [],
};

const mockUploadContentCreated = {
  _id: '62660a8e-b4a8-4379-887f-3996asdsa862d4f',
  __typename: 'Photo',
  created: '2020-06-22T17:11:46.000+00:00',
  name: uploadFile.name,
  docType: 'photo',
  url: `https://api-staging.k4connect.com/v3/content/download?${uploadFile.name}&redirect=true`,
  images: [],
};

const mockContents = [
  {
    _id: '46b5a48f-4b41-43f4-987f-aabafd63ade9',
    name: 'Design #1',
    docType: 'design',
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
    docType: 'design',
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
      query: CREATE_UPLOAD,
      variables: {
        communityId,
        files: [uploadFile],
      },
    },
    result: {
      data: {
        community: {
          getUploadUrl: [
            {
              _id: 'new-upload-id',
              name: 'chucknorris.png',
              url: 'https://aws-bucket.com/chucknorris.png',
              __typename: 'Photo',
            },
          ],
          __typename: 'Community',
        },
      },
    },
  },
  {
    request: {
      query: GET_CONTENT,
      variables: {
        id: contentId,
        communityId,
      },
    },
    result: {
      data: {
        community: {
          content: mockContentCreated,
          __typename: 'Community',
        },
      },
    },
  },
  {
    request: {
      query: GET_CONTENTS,
      variables: {
        communityId,
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
      query: CONTENT_CREATED,
      variables: {
        communityId,
        docType: ['document', 'photo'],
        owner: meId,
      },
    },
    result: {
      data: {
        contentCreated: mockContentCreated,
      },
    },
  },
  {
    request: {
      query: CONTENT_CREATED,
      variables: {
        communityId,
        docType: ['document', 'photo'],
        owner: meId,
      },
    },
    result: {
      data: {
        contentCreated: mockContentCreated,
      },
    },
  },
  {
    request: {
      query: CONTENT_CREATED,
      variables: {
        communityId,
        docType: ['document', 'photo'],
        owner: uploadContentUserId,
      },
    },
    result: {
      data: {
        contentCreated: mockUploadContentCreated,
      },
    },
  },
];

describe('PostFileSelector', () => {
  let minProps;
  let TestContextProvider;
  let mockOnChange;

  beforeEach(() => {
    mockOnChange = jest.fn();

    useLocation.mockImplementation(() => ({
      search: {
        contentId: null,
        communityId,
      },
    }));

    minProps = {
      onChange: mockOnChange,
      me: {
        _id: meId,
      },
      data: {
        _id: feedItemId,
        title: 'Software Engineer - Caregiver Experience',
        body: 'testing',
        author: 'testing',
        category: 'Notice',
        audiences: ['Resident'],
        tags: ['Integration Tests'],
        assets: [
          {
            _id: '46b5a48f-4b41-43f4-987f-aabafd63ade9',
            name: 'Design #1',
            contentId: '46b5a48f-4b41-43f4-987f-aabafd63ade9',
            images: [
              'https://api-staging.k4connect.com/v3/content/download?filename=https://k4connect-document-staging.s3.amazonaws.com/jpgs/46b5a48f-4b41-43f4-987f-aabafd63ade9.jpg&redirect=true',
            ],
            url:
              'https://staging-k4connect-documents-adapter.s3.amazonaws.com/46b5a48f-4b41-43f4-987f-aabafd63ade9.pdf',
            __typename: 'Design',
          },
          {
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
        ],
        startDate: DateTime.local()
          .plus({ days: 1 })
          .toISO()
          .toLocaleString(DateTime.DATETIME_MED),
        endDate: DateTime.local()
          .plus({ days: 5 })
          .toISO()
          .toLocaleString(DateTime.DATETIME_MED),
      },
    };

    TestContextProvider = createProvider({
      apolloProps: {
        mocks: mockQueries,
      },
    });
  });

  it('should not include web assets', async () => {
    await act(async () => {
      render(<PostFileSelector {...minProps} />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });

    await expect((await screen.findAllByRole('upload-item')).length).toBe(
      minProps.data.assets.filter((item) => item.type !== 'Web').length
    );
  });

  it('should display correct default state', async () => {
    minProps.data = undefined;

    await act(async () => {
      render(<PostFileSelector {...minProps} />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });

    expect(screen.getByText('Add File')).toBeInTheDocument();
  });

  it('should display assets from content quick action', async () => {
    useLocation.mockImplementation(() => ({
      search: {
        contentId,
        communityId,
      },
    }));

    await act(async () => {
      render(<PostFileSelector {...minProps} />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });

    await screen.findByRole('upload-item');
    expect(screen.getByText('Design #1.pdf')).toBeInTheDocument();
    expect(screen.getByText('File (1)')).toBeInTheDocument();

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should add file on upload', async () => {
    let onChangeCount = 0; // for some reason subscription fires thrice on start
    let onChangeCalled = false;
    minProps.data.assets = [];
    minProps.me._id = uploadContentUserId;

    mockOnChange.mockImplementation((key, data) => {
      if (key === 'assets') {
        onChangeCount++;
        if (onChangeCount > 3) {
          minProps.data.assets.push(data[0]);
          onChangeCalled = true;
        }
      }
    });

    await act(async () => {
      render(<PostFileSelector {...minProps} />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });

    await act(async () => {
      userEvent.click(await screen.findByText('Add File'));
    });

    const file = new File(['(⌐□_□)'], uploadFile.name, {
      type: uploadFile.type,
    });
    const input = screen.getByTestId('AP_postmodal-dropzonearea');

    Object.defineProperty(input, 'files', {
      value: [file],
    });

    await act(async () => {
      fireEvent.change(input);
      await wait(0);
    });

    expect(onChangeCalled).toBe(true);
  });

  it('should display error when upload failed', async () => {
    await act(async () => {
      render(<PostFileSelector {...minProps} />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });

    const file = new File(['(⌐□_□)'], 'chucknorris.zip', {
      type: 'zip',
    });

    const input = screen.getByTestId('AP_postmodal-dropzonearea');

    Object.defineProperty(input, 'files', {
      value: [file],
    });

    await act(async () => {
      await fireEvent.change(input);
      await wait(1000);
    });

    expect(screen.getByText(/jpg, pdf, png/).getAttribute('class')).toMatch(
      /infoSmallError/
    );
  });

  it('should be able to select a design', async () => {
    minProps.data.assets = [];
    await act(async () => {
      render(<PostFileSelector {...minProps} />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });

    userEvent.click(screen.getByText('Add File'));
    await screen.findByText(/choose design/);

    expect(screen.getByText('File')).toBeInTheDocument();
    userEvent.click(screen.getByText(/choose design/));
    await screen.findByText(/Add Design/);

    const previews = await screen.findAllByTestId(
      'AP_postmodal-content-preview'
    );

    act(() => {
      userEvent.click(previews[0]);
    });
    await waitForElementToBeRemoved(() => screen.queryByText(/Add Design/));

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await wait(1100); // wait for delay to finish

    expect(screen.getByText(/or choose design/)).toBeInTheDocument();

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should display the correct file count for a single file', async () => {
    await act(async () => {
      render(<PostFileSelector {...minProps} />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });

    expect(await screen.findByText('File (1)')).toBeInTheDocument();
  });

  it('should display the correct file count for multiple files', async () => {
    minProps.data.assets.push({
      _id: '62660a8e-b4a8-4379-887f-39965f862d4f',
      __typename: 'Document',
      created: '2020-06-22T17:11:46.000+00:00',
      name: 'summermenu_2020',
      docType: 'document',
      url:
        'https://api-staging.k4connect.com/v3/content/download?filename=https://k4connect-document-staging.s3.amazonaws.com/pdfs/62660a8e-b4a8-4379-887f-39965f862d4f.pdf&redirect=true',
      images: [],
    });

    await act(async () => {
      render(<PostFileSelector {...minProps} />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });

    expect(await screen.findByText('Files (2)')).toBeInTheDocument();
  });
});
