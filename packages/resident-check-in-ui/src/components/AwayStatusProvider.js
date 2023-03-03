import React, { createContext, useContext } from "react";
import { useLazyQuery } from "@teamhub/apollo-config";
import { GET_AWAY_STATUSES } from "../graphql/residents";

export const AwayStatusContext = createContext({});

export function AwayStatusProvider(props) {
  const [
    fetch,
    { data, loading: loadingAwayStatuses, refetch: refetchAwayStatuses },
  ] = useLazyQuery(GET_AWAY_STATUSES);
  const awayStatuses = data?.resident?.awayStatuses;

  const fetchAwayStatuses = (residentId) => {
    fetch({ variables: { residentId } });
  };

  const contextValue = {
    fetchAwayStatuses,
    loadingAwayStatuses,
    awayStatuses,
    refetchAwayStatuses,
  };

  return (
    <AwayStatusContext.Provider value={contextValue} {...props}>
      {props.children}
    </AwayStatusContext.Provider>
  );
}

export const useAwayStatusesContext = () => useContext(AwayStatusContext);
