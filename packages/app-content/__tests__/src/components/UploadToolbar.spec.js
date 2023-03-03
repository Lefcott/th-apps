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
import UploadToolbar from '../../../src/components/UploadToolbar';
import { GET_CONTENTS } from '../../../src/graphql/content';
import createProvider from '../../test-utils/createProvider';

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

describe('UploadToolbar', () => {
  let minProps;
  let TestContextProvider;
  let mockSetUploadType;
  let mockSetDocumentArr;
  let documentArr;

  beforeEach(async () => {
    mockSetUploadType = jest.fn();
    mockSetDocumentArr = jest.fn();
    documentArr = [
      {
        url: 'test.png',
        _id: 'test-id',
        images: ['test.png'],
        name: 'test name',
      },
    ];

    minProps = {
      uploadType: null,
      setUploadType: mockSetUploadType,
      documentArr,
      setDocumentArr: mockSetDocumentArr,
    };

    TestContextProvider = createProvider({
      apolloProps: {
        mocks: mockQueries,
      },
    });
  });

  it('should not display content picker by default', () => {
    render(<UploadToolbar {...minProps} />);
    expect(
      screen.queryByTestId('AP_postmodal-content-picker'),
    ).not.toBeInTheDocument();
  });

  it('should open content picker hwen when adding a design', async () => {
    minProps.uploadType = null;
    render(<UploadToolbar {...minProps} />, {
      wrapper: TestContextProvider,
    });

    expect(screen.getByRole('upload-design')).toBeEnabled();
    expect(screen.getByRole('upload-photo')).toBeEnabled();
    expect(screen.getByRole('upload-document')).toBeEnabled();

    await act(async () => {
      userEvent.click(await screen.findByRole('upload-design'));
    });

    expect(await screen.findByText('Add Design')).toBeInTheDocument();
  });

  it('should upload design', async () => {
    render(<UploadToolbar {...minProps} />, {
      wrapper: TestContextProvider,
    });

    await act(async () => {
      userEvent.click(await screen.findByRole('upload-design'));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      userEvent.click(
        (await screen.findAllByTestId('AP_postmodal-content-preview'))[0],
      );
    });

    expect(
      screen.queryByTestId('AP_postmodal-content-picker'),
    ).not.toBeInTheDocument();
    expect(mockSetDocumentArr).toHaveBeenCalledWith([mockContents[0]]);
    expect(mockSetUploadType).toHaveBeenCalledWith('design');
  });

  it('should be able to upload file', () => {
    render(<UploadToolbar {...minProps} />, {
      wrapper: TestContextProvider,
    });
    const file = new File(['(⌐□_□)'], 'chucknorris.png', {
      type: 'image/png',
    });
    const input = screen.getByTestId('AP_postmodal-uploadtoolbar-photoUpload');

    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);

    expect(mockSetUploadType).toHaveBeenCalledWith('photo');
    expect(mockSetDocumentArr).toHaveBeenCalledWith([...documentArr, file]);
  });

  it('should disable all buttons if upload has a type', async () => {
    minProps.uploadType = 'design';
    render(<UploadToolbar {...minProps} />, {
      wrapper: TestContextProvider,
    });

    expect(screen.getByRole('upload-design')).toBeDisabled();
    expect(screen.getByRole('upload-photo')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('upload-document')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });
});
