/** @format */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseTable from './base/BaseTable';
import {
  StringCell,
  PhoneNumberCell,
  AvatarCell,
} from './base/BaseTable/cell-types';
import ActionMenu from './ActionMenu';

import { useHistory } from 'react-router-dom';
import { useCurrentUser, sendPendoEvent, useFlags } from '@teamhub/api';
import ContactRemovalConfirmationModal from './AlexaContactRemovalConfirmationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';

function getTableDefinitions() {
  return [
    {
      Header: '',
      id: 'avatar',
      Cell: AvatarCell,
      width: 45,
      accessor() {
        return {
          data: {
            content: <FontAwesomeIcon icon={faIdCard} />,
          },
        };
      },
    },
    {
      Header: 'Name',
      Cell: StringCell,
      accessor: 'name',
      width: 450,
    },
    {
      Header: 'Phone Number',
      Cell: PhoneNumberCell,
      accessor: 'phoneNumbers[0]',
    },
  ];
}

export default function AlexaTable({ data, loading, refetch }) {
  const [currentUser] = useCurrentUser();
  const history = useHistory();
  const flags = useFlags();

  const columns = getTableDefinitions();
  const [openModal, setOpenModal] = useState(false);
  const [contactSelected, setContactSelected] = useState(null);

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

  useEffect(() => {
    sendPendoEvent('communitydirectory_alexa', null);
  }, []);

  const showDeleteModal = useCallback(({ data }) => {
    setContactSelected(data);
    setOpenModal(true);
  }, []);

  const showEditModal = useCallback(
    ({ data, row }) => {
      history.push({
        pathname: `/alexa/${row.id}`,
        search: history.location.search,
      });
    },
    [history],
  );

  /** @format */

  function hideModal() {
    setOpenModal(false);
  }

  async function handleDeleteConfirm() {
    refetch();
    hideModal();
  }

  const tabOptions = {
    onChange(evt, route) {
      history.push(route);
    },
    value: '/alexa',
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
  };

  const rowOptions = useMemo(
    () => ({
      emptyResultMessage: "Looks like you don't have any Alexa contacts.",
      slim: true,
      actions: [
        { key: 'edit', label: 'Edit', onClick: showEditModal },
        {
          key: 'remove',
          label: 'Remove',
          disabled: (row) => row._id === currentUser?._id,
          onClick: showDeleteModal,
          color: 'error',
        },
      ],
    }),
    [showDeleteModal, showEditModal, currentUser],
  );

  const searchOptions = {
    placeholder: 'Search by name, email, job title, or phone number',
    emptyResultMessage: (value) =>
      `We couldn’t find anything matching "${value}"`,
  };

  return (
    <>
      <ContactRemovalConfirmationModal
        contact={contactSelected}
        open={openModal}
        onCancel={hideModal}
        onConfirm={handleDeleteConfirm}
      />
      <BaseTable
        searchable
        id="SD-CC"
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

AlexaTable.defaultProps = {
  onDeleteConfirm: () => {},
};

AlexaTable.propTypes = {
  onDeleteConfirm: PropTypes.func,
};
