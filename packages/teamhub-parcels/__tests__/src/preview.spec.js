import React from 'react';
import {
  act,
  screen,
  render,
} from '@testing-library/react';
import wait from 'waait';
import userEvent from '@testing-library/user-event'
import createProvider from '@test-utils/createProvider'
import Preview from '@src/preview/components/Preview'
import { GET_CONTENT } from '@graphql/content'

const COMMUNITY_ID = '14';
const DOCUMENT_ID = "19c40802-4eb5-462b-985a-1b97cd261151"

const content = {
  rendered:"https://api-staging.k4connect.com/v2/document/documentRendered?documentId=19c40802-4eb5-462b-985a-1b97cd261151",
  __typename:"Design"
};
const getContentRequest = {
  request: {
    query: GET_CONTENT,
    variables: {
      communityId: COMMUNITY_ID,
      documentId: DOCUMENT_ID
    }
  },

  result: {
    data: {
      community: {
        content,
        __typename: "Community"
      }
    }
  }
}

describe('Preview', () => {
  let mockUnmountSelf;

  beforeEach(async () => {
    mockUnmountSelf = jest.fn();
    const mockQueries = [
      getContentRequest
    ]

    let minProps = {
      parcelData: {
       communityId: COMMUNITY_ID,
        documentId: DOCUMENT_ID       
      },
      unmountSelf: mockUnmountSelf,
    }

    const TestContextProvider = createProvider({
      apolloProps: {
        mocks: mockQueries
      }
    });

    await act(async () => {
      render(<Preview {...minProps} />, {
        wrapper: TestContextProvider
      });
      await wait(0);
    });

  })

  it('should be able to close preview modal', async () => {
    await userEvent.click(screen.getByLabelText('close-modal'));
    expect(mockUnmountSelf).toHaveBeenCalled();
  })

  it('should show document iframe', () => {
    expect(screen.getByTitle(/document/)).toHaveAttribute('src', `${content.rendered}&showControls=true`)
  })
})