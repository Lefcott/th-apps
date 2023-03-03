/** @format */
import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import BaseTable from './base/BaseTable';
import {
  UserNameCell,
  StringCell,
  PhoneNumberCell,
  AvatarCell,
} from './base/BaseTable/cell-types';
import { showToast } from '@teamhub/toast';
import StaffRemovalConfirmationModal from './StaffRemovalConfirmationModal';
import StaffAppCodeModal from './StaffAppCodeModal';
import { useHistory } from 'react-router-dom';
import { useCurrentUser, useFlags, getCommunityId } from '@teamhub/api';
import { useMutation } from '@teamhub/apollo-config';
import ActionMenu from './ActionMenu';
import { IntegrationsContext } from '../contexts/IntegrationsProvider';
import { RESET_STAFF_PASSWORD } from '../graphql/users';
import strings from '../constants/strings';

function getTableDefinitions() {
  return [
    {
      Header: '',
      id: 'avatar',
      Cell: AvatarCell,
      width: 59,
      accessor({ firstName, lastName, fullName, profileImage }) {
        const alt = fullName || 'new user';
        const content = `${firstName.charAt(0)}${lastName.charAt(0)}`;
        const src = profileImage?.includes('misc/profile.svg')
          ? null
          : profileImage;

        return {
          data: {
            alt,
            src,
            content,
          },
        };
      },
    },
    {
      width: 300,
      Header: 'Name',
      id: 'fullName',
      Cell: UserNameCell,
      accessor({ firstName, lastName, fullName, profileImage }) {
        return {
          filterable: ['fullName'],
          data: {
            firstName,
            lastName,
            fullName,
          },
        };
      },
    },
    { width: 200, Header: 'Email', Cell: StringCell, accessor: 'email' },
    { Header: 'Job Title', Cell: StringCell, accessor: 'jobTitle' },
    {
      Header: 'Primary Phone',
      Cell: PhoneNumberCell,
      accessor: 'primaryPhone',
    },
  ];
}

export default function StaffTable({ data, onDeleteConfirm, loading }) {
  const [currentUser] = useCurrentUser();
  const communityId = getCommunityId();
  const history = useHistory();
  const flags = useFlags();
  const columns = getTableDefinitions();
  const [openModal, setOpenModal] = useState(false);
  const [openAppCodeModal, setOpenAppCodeModal] = useState(false);
  const [staffSelected, setStaffSelected] = useState(null);
  const [resetPassword] = useMutation(RESET_STAFF_PASSWORD, {
    onCompleted() {
      showToast(strings.emailReset);
    },
  });
  const { integrations } = React.useContext(IntegrationsContext);
  const { staffIntegrationEnabled = false } = integrations;

  const toolbarOptions = {
    fabbable: true,
    renderPortal: true,
    actions: [
      {
        key: 'new',
        render() {
          return <ActionMenu />;
        },
      },
    ],
  };

  const showAppCodeModal = useCallback(({ data }) => {
    setStaffSelected(data);
    setOpenAppCodeModal(true);
  });

  const showDeleteModal = useCallback(({ data }) => {
    setStaffSelected(data);
    setOpenModal(true);
  }, []);

  const showEditModal = useCallback(
    ({ data }) => {
      history.push({
        pathname: `/staff/${data._id}`,
        search: history.location.search,
      });
    },
    [history],
  );

  function hideModal() {
    setOpenModal(false);
  }

  function hideAppCodeModal() {
    setOpenAppCodeModal(false);
  }

  function handleDeleteConfirm() {
    onDeleteConfirm(staffSelected);
    hideModal();
  }

  const resetUserPassword = useCallback(({ data }) => {
    const staffId = data._id;
    resetPassword({
      variables: {
        communityId,
        staffId,
      },
    });
  });

  const tabOptions = {
    value: '/staff',
    tabs: [
      {
        label: 'Staff',
        value: '/staff',
      },
      {
        label: 'Alexa',
        value: '/alexa',
        hidden: !flags['alexa-calling'],
      },
    ],
    onChange(evt, route) {
      history.push(route);
    },
  };

  const rowOptions = useMemo(
    () => ({
      slim: true,
      actions: [
        {
          key: 'get-app-code',
          label: 'Get App Code',
          onClick: showAppCodeModal,
        },
        {
          key: 'reset-password',
          label: 'Reset Password',
          onClick: resetUserPassword,
        },
        {
          key: 'edit',
          label: 'Edit',
          onClick: showEditModal,
          disabled: staffIntegrationEnabled,
        },
        {
          key: 'remove',
          label: 'Remove',
          disabled: (row) =>
            row._id === currentUser?._id || staffIntegrationEnabled,
          onClick: showDeleteModal,
          color: 'error',
        },
      ],
    }),
    [showDeleteModal, showEditModal, showAppCodeModal, currentUser],
  );

  const searchOptions = {
    placeholder: 'Search by name, email, job title, or phone number',
    emptyResultMessage: (value) =>
      `We couldn’t find anything matching "${value}"`,
  };

  return (
    <>
      <StaffRemovalConfirmationModal
        staff={staffSelected}
        open={openModal}
        onCancel={hideModal}
        onConfirm={handleDeleteConfirm}
      />
      <StaffAppCodeModal
        staff={staffSelected}
        open={openAppCodeModal}
        onConfirm={hideAppCodeModal}
      />
      <BaseTable
        searchable
        id="SD"
        data={data}
        columns={columns}
        tabOptions={tabOptions}
        rowOptions={rowOptions}
        searchOptions={searchOptions}
        toolbarOptions={toolbarOptions}
        loading={loading}
      />
    </>
  );
}

StaffTable.defaultProps = {
  onDeleteConfirm: () => {},
};

StaffTable.propTypes = {
  onDeleteConfirm: PropTypes.func,
};
