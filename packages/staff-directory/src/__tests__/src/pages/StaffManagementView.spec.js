/** @format */

import React from 'react';
import {
  screen,
  render,
  act,
  within,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import wait from 'waait';
import userEvent from '@testing-library/user-event';
import createProvider from '../../test-utils/createProvider';
import StaffManagementView from '../../../pages/StaffManagementView';
import { GET_STAFF_MEMBERS, REMOVE_STAFF_MEMBER } from '../../../graphql/users';
import { cloneDeep, merge } from 'lodash';
import { useHistory } from 'react-router-dom';
import { useCurrentUser } from '@teamhub/api';
import { GET_COMMUNITY_ADDRESS_BOOK } from '../../../graphql/address-book';
const COMMUNITY_ID = '2476';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));

const SEARCH = `?communityId=${COMMUNITY_ID}`;

const staffMembers = [
  {
    _id: 'e34a45eb-e7dc-4ba3-acdd-9daef7c72eeb',
    email: 'fake@email.com',
    firstName: 'Stanley',
    lastName: 'Afferton',
    fullName: 'Stanley Afferton',
    jobTitle: 'Supervisor',
    primaryPhone: '1234567890',
    secondaryPhone: '1234567890',
    __typename: 'Staff',
  },
  {
    _id: '81c43597-4e0a-4423-87e6-5c009201b32e',
    email: 'magnusbane@email.com',
    firstName: 'Magnus B',
    lastName: 'Bane',
    fullName: 'Magnus B Bane',
    jobTitle: 'Staff Assistant',
    primaryPhone: '1234567890',
    secondaryPhone: '1234567890',
    __typename: 'Staff',
  },
  {
    _id: '3d81d29c-4100-4cab-882e-74f278d29090',
    email: 'natalie.colli@k4connect.com',
    firstName: 'Natalie',
    lastName: 'Colli',
    fullName: 'Natalie Colli',
    jobTitle: 'Google expert',
    primaryPhone: '1234567890',
    secondaryPhone: '1234567890',
    __typename: 'Staff',
  },
];
const staffMembersRequest = {
  request: {
    query: GET_STAFF_MEMBERS,
    variables: {
      communityId: COMMUNITY_ID,
    },
  },
  result: {
    data: {
      community: {
        staffMembers,
        __typename: 'Community',
      },
    },
  },
};

const removeStaffRequest = {
  request: {
    query: REMOVE_STAFF_MEMBER,
    variables: {
      communityId: COMMUNITY_ID,
      staffId: staffMembers[0]._id,
    },
  },
  result: {
    data: {
      community: {
        staff: {
          archive: merge({ status: 'archived' }, cloneDeep(staffMembers[0])),
          __typename: 'Staff__',
        },
        __typename: 'Community',
      },
    },
  },
};

const removedStaffMembersRequest = {
  request: {
    query: GET_STAFF_MEMBERS,
    variables: {
      communityId: COMMUNITY_ID,
    },
  },
  result: {
    data: {
      community: {
        staffMembers: staffMembers.slice(1),
        __typename: 'Community',
      },
    },
  },
};

const communityAddressBookRequest = {
  request: {
    query: GET_COMMUNITY_ADDRESS_BOOK,
    variables: {
      communityId: COMMUNITY_ID,
    },
  },
  result: {
    data: {
      community: {
        alexaAddressBook: {
          contacts: [
            {
              name: 'Front Desk',
              phoneNumbers: ['1234567890'],
            },
            {
              name: 'Gym',
              phoneNumbers: ['0987654321'],
            },
          ],
        },
      },
    },
  },
};

describe('StaffManagementView', () => {
  let pushMock;
  let currentUser;

  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight',
  );
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetWidth',
  );

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 500,
    });
  });

  afterAll(() => {
    Object.defineProperty(
      HTMLElement.prototype,
      'offsetHeight',
      originalOffsetHeight,
    );
    Object.defineProperty(
      HTMLElement.prototype,
      'offsetWidth',
      originalOffsetWidth,
    );
  });

  beforeEach(async () => {
    const queryMocks = [
      staffMembersRequest,
      removeStaffRequest,
      removedStaffMembersRequest,
      communityAddressBookRequest,
    ];

    pushMock = jest.fn();
    useHistory.mockReturnValue({
      location: {
        search: SEARCH,
      },
      push: pushMock,
    });

    currentUser = staffMembers[1];
    useCurrentUser.mockReturnValue([currentUser]);

    const TestContextProvider = createProvider({
      apolloProps: {
        localState: {
          communityId: COMMUNITY_ID,
        },
        mocks: queryMocks,
      },
    });

    await act(async () => {
      render(
        <div style={{ height: '100vh' }}>
          <StaffManagementView />
        </div>,
        {
          wrapper: TestContextProvider,
        },
      );
      await wait(0);
    });
  });

  it('should render data to table', () => {
    const [head, body] = screen.getAllByRole('rowgroup');
    const { getAllByRole } = within(body);
    const rows = getAllByRole('row');
    expect(rows.length).toBe(staffMembers.length);
  });

  it('should be able to filter data', async () => {
    await act(async () => {
      await userEvent.type(
        await screen.findByRole('searchbar'),
        staffMembers[0].email,
      );
      await wait(1000);
    });
    const [head, body] = screen.getAllByRole('rowgroup');
    const { getAllByRole } = within(body);
    expect(getAllByRole('row').length).toBe(1);

    await act(async () => {
      await userEvent.click(
        await screen.findByLabelText('searchbar-adornment'),
      );
      await wait(1000);
    });

    expect(getAllByRole('row').length).toBe(3);
  });

  it('should show empty search result message', async () => {
    const searchString =
      'this search text should not have matching result @!*(#!)(&';

    await act(async () => {
      await userEvent.type(await screen.findByRole('searchbar'), searchString);
      await wait(1000);
    });

    expect(screen.getByText(/matching ".*"/gi)).toBeInTheDocument();
  });

  it('should be able to delete a staff member', async () => {
    let [head, body] = screen.getAllByRole('rowgroup');
    let group = within(body);
    const [firstRow] = group.getAllByRole('row');
    const { getByLabelText } = within(firstRow);

    await act(async () => {
      await userEvent.click(getByLabelText('menu-button'));

      await userEvent.click(screen.getByText(/^remove$/i));

      const { getByText } = within(await screen.findByRole('dialog'));
      await userEvent.click(getByText(/^remove$/i));
    });

    await screen.findByRole('table');
    group = within(screen.getAllByRole('rowgroup')[1]);

    expect(group.getAllByRole('row').length).toBe(staffMembers.length - 1);
  });

  it('should not be able to delete current user', async () => {
    let [head, body] = screen.getAllByRole('rowgroup');
    let group = within(body);
    const [firstRow, secondRow] = group.getAllByRole('row');
    const { getByLabelText } = within(secondRow);

    await act(async () => {
      await userEvent.click(getByLabelText('menu-button'));
      expect(screen.getByText(/^remove$/i).closest('li')).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });
  });

  it('should be able to cancel a staff member', async () => {
    const [head, body] = screen.getAllByRole('rowgroup');
    const group = within(body);
    const [firstRow] = group.getAllByRole('row');
    const { getByLabelText } = within(firstRow);

    await act(async () => {
      await userEvent.click(getByLabelText('menu-button'));

      await userEvent.click(screen.getByText(/^remove$/i));

      const { getByText } = within(await screen.findByRole('dialog'));
      await userEvent.click(getByText(/^cancel$/i));
    });

    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
  });

  it('should be able to open new staff form', async () => {
    await userEvent.click(screen.getByText(/new staff/i));
    expect(pushMock).toHaveBeenCalledWith({
      pathname: '/staff/new',
      search: SEARCH,
    });
  });

  it('should able to open edit staff form', async () => {
    const [head, body] = screen.getAllByRole('rowgroup');
    const group = within(body);
    const [firstRow] = group.getAllByRole('row');
    const { getByLabelText } = within(firstRow);

    await act(async () => {
      await userEvent.click(getByLabelText('menu-button'));
      await userEvent.click(screen.getByText(/^edit$/i));
    });

    expect(pushMock).toHaveBeenCalledWith({
      pathname: `/staff/${staffMembers[0]._id}`,
      search: SEARCH,
    });
  });

  it('can navigate to community address book', async () => {
    await act(async () => {
      await userEvent.click(screen.getByText(/^alexa$/i));
    });

    expect(pushMock).toHaveBeenCalledWith('/alexa');
  });
});
