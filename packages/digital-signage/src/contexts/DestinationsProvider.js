/** @format */

import React from 'react';
import { getDocumentBase } from '../utilities/url-service';
import { useCommunity } from '../contexts/CommunityProvider';
import { useSnackbar } from 'notistack';

const DestinationsContext = React.createContext();

async function fetchDestinations(communityId) {
  const type = 'Risevision Display';

  const searchParams = new URLSearchParams();
  searchParams.append('type', 'Risevision Display');
  searchParams.append('communityId', communityId);
  const res = await fetch(
    `${getDocumentBase()}/destinations?${searchParams.toString()}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    },
  );
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Error loading destinations');
  }
}

function DestinationsProvider(props) {
  const { communityId } = useCommunity();
  const { enqueueSnackbar } = useSnackbar();
  const [destinations, setDestinations] = React.useState([]);
  React.useEffect(() => {
    fetchDestinations(communityId, enqueueSnackbar)
      .then((destinations) => {
        setDestinations(destinations);
      })
      .catch((err) => {
        enqueueSnackbar('An error occurred loading the Destinations', {
          variant: 'error',
        });
      });
    //eslint-disable-next-line
  }, [communityId]);

  return (
    <DestinationsContext.Provider value={destinations}>
      {props.children}
    </DestinationsContext.Provider>
  );
}

function useDestinations() {
  const context = React.useContext(DestinationsContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
}

export { useDestinations, DestinationsProvider };
