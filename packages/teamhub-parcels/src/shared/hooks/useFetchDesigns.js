import { useState } from 'react';
import { getOneSearchParam } from "@teamhub/api";
import { useLazyQuery } from "@apollo/client";
import { GET_CONTENTS } from "@graphql/content";
import { get, uniqBy } from "lodash";

const DOCTYPE = "design";

export default function useFetchDesigns(orientation) {
  const [pageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetch, options] = useLazyQuery(GET_CONTENTS, {
    fetchPolicy: "network-only",
  });

  function getVars(search, offset=0) {
    return {
      communityId: getOneSearchParam("communityId", "2476"),
      page: {
        limit: pageSize,
        field: "Edited",
        order: "Desc",
        offset,
      },
      filters: {
        orientation: orientation || undefined,
        search: search || undefined,
        docType: DOCTYPE,
      },
    };
  }

  function fetchDesigns(search) {
    setCurrentPage(1);
    return fetch({
      variables: getVars(search),
    });
  }

  function fetchNextPage(search) {
    if (!options.loading) {
      setCurrentPage(currentPage + 1);
      options.fetchMore({
        variables: getVars(search, currentPage * pageSize),
        updateQuery(prevResult, { fetchMoreResult }) {
          const designs = get(fetchMoreResult, "community.contents", []);
          return Object.assign({}, prevResult, {
            community: {
              __typename: "Community",
              contents: uniqBy([...prevResult.community.contents, ...designs], '_id'),
            },
          });
        },
      });
    }
  }

  return [fetchDesigns, fetchNextPage, options];
}
