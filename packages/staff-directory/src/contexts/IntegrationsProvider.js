/** @format */

import React from 'react';
import { useQuery } from '@teamhub/apollo-config';
import { GET_INTEGRATIONS } from '../graphql/integrations';
import { getCommunityId } from '@teamhub/api';
import { isEmpty } from 'lodash';
export const IntegrationsContext = React.createContext();

export const IntegrationsProvider = ({ children }) => {
  const staffIntegrationFlag = ['StaffIntegrationEnabled'];

  const { data: integrationData } = useQuery(GET_INTEGRATIONS, {
    variables: { communityId: getCommunityId() },
    fetchPolicy: 'network-only',
  });

  const staffIntegration = integrationData?.community?.integrations?.filter(
    (integration) =>
      integration.properties.enabled &&
      staffIntegrationFlag.some(
        (di) => di.toLowerCase() === integration.name.toLowerCase(),
      ),
  );

  const staffIntegrationEnabled = isEmpty(staffIntegration) ? false : true;
  const integrations = {
    staffIntegrationEnabled,
  };

  return (
    <IntegrationsContext.Provider value={{ integrations }}>
      {children}
    </IntegrationsContext.Provider>
  );
};
