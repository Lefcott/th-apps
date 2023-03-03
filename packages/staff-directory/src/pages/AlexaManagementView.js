/** @format */

import React, { useEffect } from 'react';
import { GET_COMMUNITY_ADDRESS_BOOK } from '../graphql/address-book';
import { useQuery } from '@teamhub/apollo-config';
import { Box, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { getCommunityId, useFlags } from '@teamhub/api';

import AlexaTable from '../components/AlexaTable';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      height: 'fill-available',
    },
  },
}));

export default function AlexaManagementView() {
  const flags = useFlags();
  const classes = useStyles();
  const communityId = getCommunityId();
  const isMobile = useMediaQuery('(max-width:960px)');
  const history = useHistory();
  const { data, refetch, loading } = useQuery(GET_COMMUNITY_ADDRESS_BOOK, {
    fetchPolicy: 'cache-and-network',
    skip: !flags['alexa-calling'],
    nextFetchPolicy: 'cache-and-network',
    variables: {
      communityId,
    },
  });
  const contacts = data?.community?.alexaAddressBook?.contacts || [];

  useEffect(() => {
    if (history.location.state?.refetch) {
      refetch();
    }
  }, [history.location.state?.refetch]);

  return (
    <Box className={classes.root} display="flex" pt={isMobile ? 3 : 0}>
      <AlexaTable data={contacts} loading={loading} refetch={refetch} />
    </Box>
  );
}
