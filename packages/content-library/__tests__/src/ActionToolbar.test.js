import React from 'react';
import { render } from '@testing-library/react';
import { contentSections } from '../../src/utils/componentData';
import ActionToolbar from '../../src/components/ActionToolbar';
import createTestProvider from '../utils/createTestProvider';

// **************
//  TODO these are old tests that need to be updated
// **************

let TestProvider;
let apolloMocks = [];

beforeEach(() => {
  TestProvider = createTestProvider({ apolloProps: { mocks: apolloMocks } });
});

test.skip('Upload accepts correct file extensions', () => {
  const { getByTestId, rerender } = render(
    // This will render under the Main Library section
    <ActionToolbar section={{}} isMultiView />,
    { wrapper: TestProvider }
  );
  const uploadButton = getByTestId('fileUpload');
  expect(uploadButton.accept).toEqual(
    'image/jpeg,image/png,image/gif,application/pdf'
  );

  // This will render under the Photos section
  rerender(<ActionToolbar section={contentSections[1]} isMultiView={false} />);
  expect(uploadButton.accept).toEqual('image/jpeg,image/png,image/gif');

  // This will render under the Documents section
  rerender(<ActionToolbar section={contentSections[2]} isMultiView={false} />);
  expect(uploadButton.accept).toEqual('application/pdf');
});

test.skip('Upload/Create buttons exists in correct views', () => {
  const { queryByText, queryByTestId, rerender } = render(
    // This will render under the Main Library section
    <ActionToolbar section={{}} isMultiView />,
    { wrapper: TestProvider }
  );
  expect(queryByTestId('backButton')).toBeNull();
  expect(queryByText('Create a design')).toBeTruthy();
  expect(queryByText('Upload')).toBeTruthy();

  // This will render under the Designs section
  rerender(<ActionToolbar section={contentSections[0]} isMultiView={false} />);
  expect(queryByTestId('backButton')).toBeTruthy();
  expect(queryByText('Upload')).toBeNull();
  expect(queryByText('Create a design')).toBeTruthy();

  // This will render under the Documents section
  rerender(<ActionToolbar section={contentSections[2]} isMultiView={false} />);
  expect(queryByTestId('backButton')).toBeTruthy();
  expect(queryByText('Create a design')).toBeNull();
  expect(queryByText('Upload')).toBeTruthy();
});
