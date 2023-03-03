/** @format */

import React from 'react';
import { useQuery } from '@teamhub/apollo-config';
import { GET_INTEGRATIONS } from '../graphql/integrations';
import { getCommunityId } from '@teamhub/api';
import { isEmpty } from 'lodash';
export const IntegrationsContext = React.createContext();

export const IntegrationsProvider = ({ children }) => {
  const diningItegrations = ['Grove'];

  const { data: integrationData } = useQuery(GET_INTEGRATIONS, {
    variables: { communityId: getCommunityId() },
    fetchPolicy: 'network-only',
  });

  let enabledDiningIntegrations =
    integrationData?.community?.integrations?.filter(
      (integration) =>
        integration.properties.enabled &&
        diningItegrations.some((di) => di.toLowerCase() === integration.name)
    );
  enabledDiningIntegrations = isEmpty(enabledDiningIntegrations)
    ? null
    : enabledDiningIntegrations;
  return (
    <IntegrationsContext.Provider value={{ enabledDiningIntegrations }}>
      {children}
    </IntegrationsContext.Provider>
  );
};
