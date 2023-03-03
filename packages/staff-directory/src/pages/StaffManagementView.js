/** @format */

import React, { useEffect } from 'react';
import { GET_STAFF_MEMBERS, REMOVE_STAFF_MEMBER } from '../graphql/users';
import { useQuery, useMutation } from '@teamhub/apollo-config';
import { showToast } from '@teamhub/toast';
import { Box, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { getCommunityId } from '@teamhub/api';

import StaffTable from '../components/StaffTable';
import { useDepartments } from '../components/departmentContext';
import { useHistory } from 'react-router-dom';
import IntegrationsWarning from '../components/IntegrationsWarning';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      height: 'fill-available',
    },
  },
}));

export default function StaffManagementView() {
  const classes = useStyles();
  const communityId = getCommunityId();
  const [departments, setDepartments] = useDepartments();
  const isMobile = useMediaQuery('(max-width:960px)');
  const history = useHistory();

  const { data, refetch, loading } = useQuery(GET_STAFF_MEMBERS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'network-only',
    variables: {
      communityId,
    },
    onCompleted: ({ community: { staffMembers } }) => {
      setDepartments([
        ...new Set(
          staffMembers
            .filter(({ department }) => department)
            .map(({ department }) => department),
        ),
      ]);
    },
  });
  const staffMembers = data?.community?.staffMembers || [];
  const [archiveStaff] = useMutation(REMOVE_STAFF_MEMBER);
  async function handleOnDelete(row) {
    await archiveStaff({ variables: { communityId, staffId: row._id } });
    await refetch();
    showToast(`${row.fullName} removed from directory.`);
  }

  useEffect(() => {
    if (history.location.state?.refetch) {
      refetch();
    }
  }, [history.location.state?.refetch]);

  return (
    <>
      <IntegrationsWarning />
      <Box className={classes.root} display="flex" pt={isMobile ? 3 : 0}>
        <StaffTable
          data={staffMembers}
          onDeleteConfirm={handleOnDelete}
          loading={loading}
        />
      </Box>
    </>
  );
}
