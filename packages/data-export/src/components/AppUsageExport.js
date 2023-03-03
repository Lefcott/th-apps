import React, { useState } from 'react';

import { getCommunityId } from '@teamhub/api';
import { showToast } from '@teamhub/toast';
import { Typography } from '@material-ui/core';

import ExportListItem from './ExportListItem';
import ExportDialog from './ExportDialog';
import strings from '../constants/strings';
import fileExport from '../utils/fileExport';
import axiosImpl from '../utils/axiosImpl';

/**
 * Component handling App Usage data exporting.
 *
 * Uses custom API endpoint for the app usage data.
 * @returns
 */
export default function AppUsageExport() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const controller = new AbortController();
  const communityId = getCommunityId();

  const handleOpen = () => setIsDialogOpen(true);

  const handleClose = () => {
    setIsDialogOpen(false);
    controller.abort();
  };

  // Configuration for exporting
  const exportConfiguration = {
    'MEMBERDim.lastName': {
      order: 1,
      label: 'Last Name',
    },
    'MEMBERDim.firstName': {
      order: 0,
      label: 'First Name',
    },
    'DAILYUserSnapshotFacts.dwm': {
      order: 2,
      label: 'Daily/Monthly/Weekly',
    },
    'DAILYUserSnapshotFacts.sumTotalActionsApp': {
      order: 3,
      label: 'Total Actions',
    },
  };

  // Query for the API
  const generateQuery = () => {
    const query = {
      dimensions: [
        'MEMBERDim.firstName',
        'MEMBERDim.lastName',
        'DAILYUserSnapshotFacts.dwm',
      ],
      measures: ['DAILYUserSnapshotFacts.sumTotalActionsApp'],
      timeDimensions: [
        {
          dimension: 'DATEDim.fullDate',
          dateRange: 'from 90 days ago to now',
          granularity: 'day',
        },
      ],
      filters: [
        {
          member: 'COMMUNITYDim.communitySsoId',
          operator: 'equals',
          values: [communityId],
        },
      ],
    };

    const stringify = JSON.stringify(query);
    const encoded = encodeURIComponent(stringify);
    return encoded;
  };

  // Cleanup for errors when exporting
  const axiosError = (error) => {
    showToast(strings.export.exportFailure);
    setIsLoading(false);
    setIsDialogOpen(false);
  };

  // Builds a filename for the download
  const generateFileName = (dateRange) => {
    let fileName = `app-usage-${communityId}`;
    if (Array.isArray(dateRange)) {
      const start = dateRange[0];
      const end = dateRange[1];
      const tPos = start.indexOf('T');
      const startDate = start.substring(0, tPos);
      const endDate = end.substring(0, tPos);
      fileName += `-${startDate}-to-${endDate}`;
    }
    return fileName;
  };

  // Handles processing data after API call
  const postAction = (response) => {
    const dataSet = response?.data?.results?.[0];
    const { dateRange } = dataSet.query.timeDimensions[0];

    if (dataSet) {
      const fileName = generateFileName(dateRange);
      fileExport(dataSet.data, exportConfiguration, fileName, 'csv');
      showToast(strings.export.exportSuccessful);
    } else {
      showToast(strings.export.exportFailure);
    }
    setIsLoading(false);
    setIsDialogOpen(false);
  };

  // export action
  const action = () => {
    setIsLoading(true);
    const path = '/v2/cube/cubejs-api/v1/load';
    const encodedQuery = generateQuery();
    const queryString = `?queryType=multi&query=${encodedQuery}`;
    try {
      axiosImpl(path, queryString, postAction, axiosError);
    } catch (e) {
      axiosError(e);
    }
  };

  // the export modal / dialog
  const modal = () => {
    const content = (
      <>
        <Typography variant="h6">
          {strings.export.appUsageModal.description}
        </Typography>
        <Typography variant="body1">
          {strings.export.appUsageModal.first}
        </Typography>
        <Typography variant="body1">
          {strings.export.appUsageModal.last}
        </Typography>
        <Typography variant="body1">
          {strings.export.appUsageModal.dwm}
        </Typography>
        <Typography variant="body1">
          {strings.export.appUsageModal.appUsage}
        </Typography>
      </>
    );
    const modalBox = (
      <ExportDialog
        content={content}
        handleClose={handleClose}
        isDialogOpen={isDialogOpen}
        action={action}
        isLoading={isLoading}
        fullWidth={false}
      />
    );
    return modalBox;
  };

  return (
    <>
      <ExportListItem
        label={strings.export.appUsage}
        buttonLabel={strings.export.export}
        buttonAction={handleOpen}
      />
      {modal()}
    </>
  );
}
