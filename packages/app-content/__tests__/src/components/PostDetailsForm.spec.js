/** @format */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateTime } from 'luxon';
import PostDetailsForm from '../../../src/components/PostDetailsForm';
import createProvider from '../../test-utils/createProvider';

describe('PostFormDetails', () => {
  let minProps;
  let mockOnChange;
  beforeEach(() => {
    mockOnChange = jest.fn();
    minProps = {
      onChange: mockOnChange,
      data: {
        category: 'Notice',
        audiences: ['Resident'],
        tags: [],
        startDate: DateTime.local(),
        endDate: DateTime.local().plus(1, 'day'),
      },
    };
  });

  describe('Add', () => {
    beforeEach(async () => {
      const TestContextProvider = createProvider();

      await act(async () => {
        render(<PostDetailsForm {...minProps} />, {
          wrapper: TestContextProvider,
        });
      });
    });

    it('should repopulate category', async () => {
      const categoryInput = await screen.findByLabelText('Category');
      expect(categoryInput.value).toBe(minProps.data.category);
      expect(categoryInput).toBeEnabled();
    });

    it('should update category field', async () => {
      await act(async () => {
        userEvent.click(screen.getByLabelText('Category'));
        await userEvent.click(await screen.findByText('Video'));
      });

      expect(mockOnChange).toHaveBeenCalledWith('category', 'Video');
    });

    it('should repopulate audiences fields', () => {
      minProps.data.audiences.forEach((audience) => {
        expect(
          screen.getByTestId(`AP_postmodal-audience-${audience}`),
        ).toHaveClass('selected');
      });
    });

    it('should select another audience', () => {
      userEvent.click(screen.getByTestId('AP_postmodal-audience-Family'));
      expect(mockOnChange).toHaveBeenCalledWith('audiences', [
        'Resident',
        'Family',
      ]);
    });

    it('should prevent user from deselecting last audience', () => {
      userEvent.click(screen.getByTestId('AP_postmodal-audience-Resident'));
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should set tags to empty by default', async () => {
      const localMinProps = { ...minProps, tags: undefined };
      const TestContextProvider = createProvider();

      await act(async () => {
        render(<PostDetailsForm {...localMinProps} />, {
          wrapper: TestContextProvider,
        });
      });

      expect(screen.getAllByLabelText('Tags')[0]).toHaveValue('');
    });

    it('should allow user to create new tags', async () => {
      var tagName = 'New Tags';
      userEvent.type(screen.getByLabelText('Tags'), tagName);

      userEvent.click(await screen.findByTestId('AP_postmodal-create-tag'));

      expect(mockOnChange).toHaveBeenCalledWith('tags', [tagName]);
    });
  });

  describe('Edit', () => {
    beforeEach(async () => {
      const editData = {
        ...minProps.data,
        _id: 'test id',
      };

      const TestContextProvider = createProvider();

      await act(async () => {
        render(<PostDetailsForm {...minProps} data={editData} />, {
          wrapper: TestContextProvider,
        });
      });
    });

    it('should disable category field', async () => {
      const categoryInput = await screen.findByLabelText('Category');
      expect(categoryInput.value).toBe(minProps.data.category);
      expect(categoryInput).toBeDisabled();
    });
  });
});
