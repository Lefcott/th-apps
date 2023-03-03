/** @format */

import React from 'react';
import { screen, render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchFilter from '../../../src/components/SearchFilter';

describe('ContentPreview', () => {
  let minProps;
  let mockSetKeyword;

  beforeEach(async () => {
    mockSetKeyword = jest.fn();
    minProps = {
      disabled: false,
      keyword: 'testing',
      setKeyword: mockSetKeyword,
    };

    await act(async () => {
      render(<SearchFilter {...minProps} />);
    });
  });

  it('should display search keyword', () => {
    expect(screen.getByDisplayValue('testing')).toBeInTheDocument();
  });

  it('should be able clear the search content', async () => {
    userEvent.click(
      await screen.findByTestId('AP_postmodal_search-filter-clear'),
    );

    expect(await screen.findByDisplayValue('')).toBeInTheDocument();
    expect(mockSetKeyword).toHaveBeenCalled();
  });
});
