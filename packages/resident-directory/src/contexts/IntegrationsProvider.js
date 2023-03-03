/** @format */

import React from 'react';
import { useQuery } from '@teamhub/apollo-config';
import { GET_INTEGRATIONS } from '../graphql/integrations';
import { getCommunityId } from '@teamhub/api';
import { isEmpty } from 'lodash';
export const IntegrationsContext = React.createContext();

export const IntegrationsProvider = ({ children }) => {
  const residentIntegrationFlag = ['ResidentIntegrationEnabled'];
  const familyIntegrationFlag = ['FamilyIntegrationEnabled'];
  const disableDirectoryOptOutFlag = ['DisableDirectoryOptOut'];
  const disableRciOptOutFlag = ['DisableRciOptOut'];

  const { data: integrationData } = useQuery(GET_INTEGRATIONS, {
    variables: { communityId: getCommunityId() },
    fetchPolicy: 'network-only',
  });

  const residentIntegration = integrationData?.community?.integrations?.filter(
    (integration) =>
      integration.properties.enabled &&
      residentIntegrationFlag.some(
        (di) => di.toLowerCase() === integration.name.toLowerCase()
      )
  );

  const residentIntegrationEnabled = isEmpty(residentIntegration)
    ? false
    : true;

  const familyIntegration = integrationData?.community?.integrations?.filter(
    (integration) =>
      integration.properties.enabled &&
      familyIntegrationFlag.some(
        (di) => di.toLowerCase() === integration.name.toLowerCase()
      )
  );

  const familyIntegrationEnabled = isEmpty(familyIntegration) ? false : true;

  const rciOptOut = integrationData?.community?.integrations?.filter(
    (integration) =>
      integration.properties.enabled &&
      disableRciOptOutFlag.some(
        (di) => di.toLowerCase() === integration.name.toLowerCase()
      )
  );

  const rciOptOutDisabled = isEmpty(rciOptOut) ? false : true;

  const directoryOptOut = integrationData?.community?.integrations?.filter(
    (integration) =>
      integration.properties.enabled &&
      disableDirectoryOptOutFlag.some(
        (di) => di.toLowerCase() === integration.name.toLowerCase()
      )
  );

  const directoryOptOutDisabled = isEmpty(directoryOptOut) ? false : true;

  const integrations = {
    residentIntegrationEnabled,
    familyIntegrationEnabled,
    rciOptOutDisabled,
    directoryOptOutDisabled,
  };

  return (
    <IntegrationsContext.Provider value={{ integrations }}>
      {children}
    </IntegrationsContext.Provider>
  );
};
