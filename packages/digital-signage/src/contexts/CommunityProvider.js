/** @format */

import React from 'react';
import { getOneSearchParam } from '@teamhub/api';
import { getSSOBase } from '../utilities/url-service';
import moment from 'moment-timezone';
import { useSnackbar } from 'notistack';
export const CommunityContext = React.createContext();

async function getCommunity(associationId) {
  const res = await fetch(`${getSSOBase()}/associations/${associationId}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Error fetching community association');
  }
}

export const CommunityProvider = (props) => {
  const [community, setCommunity] = React.useState(null);
  const [communityId, setCommunityId] = React.useState(
    getOneSearchParam('communityId'),
  );
  const { enqueueSnackbar } = useSnackbar();

  // set timezone for module
  React.useEffect(() => {
    if (communityId) {
      getCommunity(communityId)
        .then((community) => {
          const communityMeta = JSON.parse(community.data);
          const timezone = communityMeta.timezone;
          setCommunity({ ...community, timezone });
          moment.tz.setDefault(timezone);
        })
        .catch((err) => {
          enqueueSnackbar('An error occured fetching community information', {
            variant: 'error',
          });
        });
    }
    // eslint-disable-next-line
  }, [communityId]);
  const value = {
    ...community,
    communityId,
  };
  return (
    <CommunityContext.Provider value={value}>
      {community ? props.children : null}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = React.useContext(CommunityContext);

  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }

  return context;
};
