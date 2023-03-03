import React, { createContext, useContext, useEffect } from "react";
import { useLazyQuery } from "@teamhub/apollo-config";
import { GET_COMMUNITY_SETTINGS } from "../graphql/community";
import { getOneSearchParam } from "../utilities/url";


export const communityContext = createContext({});

export function CommunityProvider(props) {
  const [
    fetchCommunity,
    { data, loading: loadingCommunity, refetch: refetchCommunity },
  ] = useLazyQuery(GET_COMMUNITY_SETTINGS);

  const communityId = getOneSearchParam("communityId", "2476");

  const contextValue = {
    loadingCommunity,
    community: data?.community,
    refetchCommunity,
  };

  useEffect(() => {
    fetchCommunity({ variables: { communityId } });
  }, [communityId]);

  return (
    <communityContext.Provider value={contextValue} {...props}>
      {props.children}
    </communityContext.Provider>
  );
}

export const useCommunityContext = () => useContext(communityContext);
