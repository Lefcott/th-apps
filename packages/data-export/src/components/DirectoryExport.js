import React, { useState } from 'react';
import { useLazyQuery } from '@teamhub/apollo-config';
import { Typography } from '@material-ui/core';
import { showErrorToast, showToast } from '@teamhub/toast';
import { getCommunityId } from '@teamhub/api';

import ExportListItem from './ExportListItem';
import ExportDialog from './ExportDialog';
import { GET_RESIDENTS } from '../graphql/directory';
import fileExport from '../utils/fileExport';
import strings from '../constants/strings';

export default function DirectoryExport() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const communityId = getCommunityId();

  const [getResidents, { loading }] = useLazyQuery(GET_RESIDENTS, {
    variables: {
      communityId,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted(data) {
      const residents = data.community.residents;
      const exportConfiguration = {
        firstName: {
          order: 0,
          label: 'First Name',
        },
        lastName: {
          order: 1,
          label: 'Last Name',
        },
        address: {
          order: 2,
          label: 'Address',
        },
        building: {
          order: 3,
          label: 'Building Name',
        },
        primaryPhone: {
          order: 4,
          label: 'Primary Phone',
        },
        secondaryPhone: {
          order: 5,
          label: 'Secondary Phone',
        },
        email: {
          order: 6,
          label: 'Email',
        },
        birthdate: {
          order: 7,
          label: 'Birthdate',
        },
        gender: {
          order: 8,
          label: 'Gender',
        },
        careSetting: {
          order: 9,
          label: 'Care Setting',
        },
        residentGroups: {
          order: 10,
          label: 'Resident Groups',
          transform: (value) =>
            value?.map((group) => group.name).join(', ') ?? '',
        },
        biography: {
          order: 11,
          label: 'Biography',
        },
        checkin: {
          order: 12,
          label: 'Check-In Alerts',
          transform: (value) => (value ? 'On' : 'Off'),
        },
        optOutOfDirectory: {
          order: 13,
          label: 'Visibility',
          transform: (value) => (value ? 'On' : 'Off'),
        },
      };

      fileExport(
        residents,
        exportConfiguration,
        `directory-community-${communityId}`,
        'csv'
      );
      setIsDialogOpen(false);
      showToast(strings.export.exportSuccessful);
    },
    onError() {
      showErrorToast(strings.export.exportFailure);
    },
  });

  const handleClose = () => {
    setIsDialogOpen(false);
  };
  const handleOpen = () => setIsDialogOpen(true);

  const modal = () => {
    const content = (
      <>
        <Typography variant="h6">
          {strings.export.directoryModal.description}
        </Typography>
        <Typography variant="body1">
          {strings.export.directoryModal.details}
        </Typography>
      </>
    );
    const modalBox = (
      <ExportDialog
        content={content}
        handleClose={handleClose}
        isDialogOpen={isDialogOpen}
        action={getResidents}
        isLoading={loading}
        fullWidth={false}
      />
    );
    return modalBox;
  };

  return (
    <>
      <ExportListItem
        label={strings.export.directory}
        buttonLabel={strings.export.export}
        buttonAction={handleOpen}
      />
      {modal()}
    </>
  );
}
