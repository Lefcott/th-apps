/** @format */

import React from 'react';
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import wait from 'waait';
import createProvider from '../../test-utils/createProvider';
import StaffModal from '../../../pages/StaffModal';
import {
  GET_STAFF_MEMBER,
  UPDATE_STAFF_MEMBER,
  ADD_STAFF_MEMBER,
  GET_STAFF_MEMBERS,
} from '../../../graphql/users';
import { useHistory, useParams } from 'react-router-dom';
import { showToast } from '@teamhub/toast';
import userEvent from '@testing-library/user-event';
import { cloneDeep, merge, omit } from 'lodash';
import flushPromises from 'flush-promises';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
  useParams: jest.fn(),
}));

const COMMUNITY_ID = '2476';
const SEARCH = `?communityId=${COMMUNITY_ID}`;
const OMITTED_FIELDS = ['_id', '__typename', 'fullName', 'roles'];

const staff = {
  _id: 'e34a45eb-e7dc-4ba3-acdd-9daef7c72eeb',
  email: 'fake@email.com',
  firstName: 'Stanley',
  lastName: 'Afferton',
  fullName: 'Stanley Afferton',
  jobTitle: 'Supervisor',
  primaryPhone: '9196997123',
  secondaryPhone: '9196997124',
  publicProfile: true,
  visibleEmail: true,
  visiblePhone: true,
  roles: [],
  __typename: 'Staff',
};

const existingStaff = {
  _id: 'e34a45eb-e7dc-4ba3-acdd-9daef7c72eeb',
  email: 'existing@email.com',
  firstName: 'Stanley',
  lastName: 'Afferton',
  fullName: 'Stanley Afferton',
  jobTitle: 'Supervisor',
  primaryPhone: '9196997123',
  secondaryPhone: '9196997124',
  publicProfile: true,
  visibleEmail: true,
  visiblePhone: true,
  roles: [],
  __typename: 'Staff',
};

const editedStaff = {
  _id: 'e34a45eb-e7dc-4ba3-acdd-9daef7c72eeb',
  email: 'magnusbane@email.com',
  firstName: 'Magnus B',
  lastName: 'Bane',
  fullName: 'Magnus B Bane',
  jobTitle: 'Staff Assistant',
  primaryPhone: '9196997123',
  secondaryPhone: '9196997124',
  publicProfile: true,
  visibleEmail: true,
  visiblePhone: true,
  roles: [],
  __typename: 'Staff',
};

const staffMemberRequest = {
  request: {
    query: GET_STAFF_MEMBER,
    variables: {
      communityId: COMMUNITY_ID,
      staffId: staff._id,
    },
  },
  result: {
    data: {
      staff,
    },
  },
};

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
        staffMembers: [staff],
        __typename: 'Community',
      },
    },
  },
};

const addStaffMemberRequest = {
  request: {
    query: ADD_STAFF_MEMBER,
    variables: {
      communityId: COMMUNITY_ID,
      sendPasswordResetEmail: true,
      newStaffInput: omit(
        merge(cloneDeep(staff), {
          primaryPhone: formatPhoneForTest(staff.primaryPhone),
          secondaryPhone: formatPhoneForTest(staff.secondaryPhone),
        }),
        OMITTED_FIELDS,
      ),
    },
  },
  result: {
    data: {
      community: {
        addStaff: staff,
        __typename: 'Community_',
      },
    },
  },
};

const addExistingStaffMemberRequest = {
  request: {
    query: ADD_STAFF_MEMBER,
    variables: {
      communityId: COMMUNITY_ID,
      sendPasswordResetEmail: true,
      newStaffInput: omit(
        merge(cloneDeep(existingStaff), {
          primaryPhone: formatPhoneForTest(staff.primaryPhone),
          secondaryPhone: formatPhoneForTest(staff.secondaryPhone),
        }),
        OMITTED_FIELDS,
      ),
    },
  },
  result: {
    errors: [
      {
        extensions: {
          response: {
            body: 'user already exists.',
          },
        },
      },
    ],
  },
};

const updateStaffMemberRequest = {
  request: {
    query: UPDATE_STAFF_MEMBER,
    variables: {
      communityId: COMMUNITY_ID,
      staffId: staff._id,
      sendPasswordResetEmail: true,
      edits: omit(
        merge(cloneDeep(editedStaff), {
          primaryPhone: formatPhoneForTest(editedStaff.primaryPhone),
          secondaryPhone: formatPhoneForTest(editedStaff.secondaryPhone),
        }),
        OMITTED_FIELDS,
      ),
      deletions: ['department', 'profileImage'],
    },
  },
  result: {
    data: {
      community: {
        staff: {
          update: editedStaff,
          __typename: 'Staff_',
        },
        __typename: 'Community_',
      },
    },
  },
};

function formatPhoneForTest(phoneNumber) {
  const match = phoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/);
  return `(${match[1]}) ${match[2]}-${match[3]}`;
}

describe('StaffModal', () => {
  let showToastMock;
  let pushMock;
  let TestContextProvider;
  beforeEach(() => {
    pushMock = jest.fn();
    showToastMock = showToast;
    useHistory.mockReturnValue({
      location: {
        search: SEARCH,
      },
      push: pushMock,
    });

    const queryMocks = [
      staffMemberRequest,
      updateStaffMemberRequest,
      addStaffMemberRequest,
      staffMembersRequest,
      addExistingStaffMemberRequest,
    ];

    TestContextProvider = createProvider({
      apolloProps: {
        mocks: queryMocks,
      },
    });
  });

  it('should be able to add a staff', async () => {
    useParams.mockReturnValue({ id: 'new' });

    await act(async () => {
      render(<StaffModal />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });

    await act(async () => {
      await userEvent.type(
        await screen.findByLabelText(/first name/i),
        staff.firstName,
      );
      await userEvent.type(
        await screen.findByLabelText(/last name/i),
        staff.lastName,
      );
      await userEvent.type(
        await screen.findByLabelText(/^email/i),
        staff.email,
      );
      await userEvent.type(
        await screen.findByLabelText(/job title/i),
        staff.jobTitle,
      );
      await fireEvent.change(await screen.findByLabelText(/primary phone/i), {
        target: {
          value: staff.primaryPhone,
        },
      });
      await fireEvent.change(await screen.findByLabelText(/secondary phone/i), {
        target: {
          value: staff.secondaryPhone,
        },
      });

      await userEvent.click(await screen.findByText(/^add$/i));
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith({
        pathname: '/staff',
        search: SEARCH,
      });
    });
  });

  it('should be able to edit a staff', async () => {
    useParams.mockReturnValue({ id: staff._id });

    await act(async () => {
      render(<StaffModal />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });

    await act(async () => {
      await userEvent.clear(await screen.findByLabelText(/first name/i));
      await userEvent.type(
        await screen.findByLabelText(/first name/i),
        editedStaff.firstName,
      );

      await userEvent.clear(await screen.findByLabelText(/last name/i));
      await userEvent.type(
        await screen.findByLabelText(/last name/i),
        editedStaff.lastName,
      );

      await userEvent.clear(await screen.findByLabelText(/^email/i));
      await userEvent.type(
        await screen.findByLabelText(/^email/i),
        editedStaff.email,
      );

      await userEvent.click(await screen.findByLabelText(/password reset/i));

      await userEvent.clear(await screen.findByLabelText(/job title/i));
      await userEvent.type(
        await screen.findByLabelText(/job title/i),
        editedStaff.jobTitle,
      );

      await userEvent.clear(await screen.findByLabelText(/primary phone/i));
      await fireEvent.change(await screen.findByLabelText(/primary phone/i), {
        target: {
          value: editedStaff.primaryPhone,
        },
      });

      await userEvent.clear(await screen.findByLabelText(/secondary phone/i));
      await fireEvent.change(await screen.findByLabelText(/secondary phone/i), {
        target: {
          value: editedStaff.secondaryPhone,
        },
      });

      await userEvent.click(screen.getByText(/update/i));
      await flushPromises();
    });

    expect(pushMock).toHaveBeenCalledWith({
      pathname: '/staff',
      search: SEARCH,
    });
  });

  it('should not be able to submit a duplicate email address', async () => {
    useParams.mockReturnValue({ id: 'new' });

    await act(async () => {
      render(<StaffModal />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });

    await act(async () => {
      await userEvent.type(
        await screen.findByLabelText(/first name/i),
        existingStaff.firstName,
      );
      await userEvent.type(
        await screen.findByLabelText(/last name/i),
        existingStaff.lastName,
      );
      await userEvent.type(
        await screen.findByLabelText(/^email/i),
        existingStaff.email,
      );

      await userEvent.clear(await screen.findByLabelText(/job title/i));
      await userEvent.type(
        await screen.findByLabelText(/job title/i),
        existingStaff.jobTitle,
      );

      await userEvent.clear(await screen.findByLabelText(/primary phone/i));
      await fireEvent.change(await screen.findByLabelText(/primary phone/i), {
        target: {
          value: existingStaff.primaryPhone,
        },
      });

      await userEvent.clear(await screen.findByLabelText(/secondary phone/i));
      await fireEvent.change(await screen.findByLabelText(/secondary phone/i), {
        target: {
          value: existingStaff.secondaryPhone,
        },
      });

      await userEvent.click(screen.getByText(/^add$/i));
    });
    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });

  it('should not be able to submit without required fields', async () => {
    useParams.mockReturnValue({ id: 'new' });

    await act(async () => {
      render(<StaffModal />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });

    await act(async () => {
      await userEvent.clear(await screen.findByLabelText(/job title/i));
      await userEvent.type(
        await screen.findByLabelText(/job title/i),
        staff.jobTitle,
      );

      await userEvent.clear(await screen.findByLabelText(/primary phone/i));
      await fireEvent.change(await screen.findByLabelText(/primary phone/i), {
        target: {
          value: staff.primaryPhone,
        },
      });

      await userEvent.clear(await screen.findByLabelText(/secondary phone/i));
      await fireEvent.change(await screen.findByLabelText(/secondary phone/i), {
        target: {
          value: staff.secondaryPhone,
        },
      });

      await userEvent.click(screen.getByText(/^add$/i));
    });

    expect(screen.getByText(/^add$/i).closest('button')).toBeDisabled();

    expect(pushMock).not.toHaveBeenCalled();
  });

  it('should not be able to submit with invalid phone numbers', async () => {
    const partialPhoneNumber = '9192323';
    const invalidPhoneNumber = '1111111111';
    useParams.mockReturnValue({ id: 'new' });

    await act(async () => {
      render(<StaffModal />, {
        wrapper: TestContextProvider,
      });
      await wait(0);
    });

    await act(async () => {
      await userEvent.type(
        await screen.findByLabelText(/first name/i),
        staff.firstName,
      );
      await userEvent.type(
        await screen.findByLabelText(/last name/i),
        staff.lastName,
      );
      await userEvent.type(
        await screen.findByLabelText(/^email/i),
        staff.email,
      );
      await userEvent.type(
        await screen.findByLabelText(/job title/i),
        staff.jobTitle,
      );
      await fireEvent.change(await screen.findByLabelText(/primary phone/i), {
        target: {
          value: partialPhoneNumber,
        },
      });
      await fireEvent.change(await screen.findByLabelText(/secondary phone/i), {
        target: {
          value: invalidPhoneNumber,
        },
      });

      await userEvent.click(await screen.findByText(/^add$/i));
      await flushPromises();
    });

    expect(
      screen.getByText(/Primary phone must be a valid phone number/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Secondary phone must be a valid phone number/i),
    ).toBeInTheDocument();

    expect(pushMock).not.toHaveBeenCalled();
  });
});
