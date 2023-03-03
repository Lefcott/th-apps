/** @format */

import React from 'react';
import { screen, render } from '@testing-library/react';
import { FormLoader, FullPageSpinner } from '../../../src/utils/loaders';

describe('utils - loaders', () => {
  it('should render form loader', () => {
    render(<FormLoader />);
    expect(screen.getAllByRole('presentation')[0]).toBeInTheDocument();
  });

  it('should render full page spinner', () => {
    render(<FullPageSpinner />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
