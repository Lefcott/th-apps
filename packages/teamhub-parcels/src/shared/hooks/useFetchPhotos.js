import { useState } from "react";
import { get } from "lodash";
import { useCurrentUser, getCommunityId } from "@teamhub/api";
import { useLazyQuery, useSubscription } from "@apollo/client";
import { GET_CONTENTS, CONTENT_CREATED } from "@graphql/content";

const DOCTYPE = "photo";

export default function useFetchPhotos(onlyMine, { beforeUpdate }) {
  const [user] = useCurrentUser();
  const [pageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetch, options] = useLazyQuery(GET_CONTENTS, {
    fetchPolicy: "network-only",
  });

  useSubscription(CONTENT_CREATED, {
    variables: {
      docType: [DOCTYPE],
      communityId: getCommunityId(),
      owner: user?._id,
    },
    onSubscriptionData({ subscriptionData }) {
      const newData = get(subscriptionData, "data.contentCreated");
      return options.updateQuery((prev) => {
        if (!subscriptionData.data) return prev;

        const content = beforeUpdate ? beforeUpdate(newData) : newData;

        if (content === null) return prev;

        return Object.assign({}, prev, {
          community: {
            __typename: "Community",
            contents: [content, ...prev.community.contents],
          },
        });
      });
    },
  });

  function getVars(search, offset = 0) {
    return {
      communityId: getCommunityId(),
      page: {
        limit: pageSize,
        field: "Edited",
        order: "Desc",
        offset,
      },
      filters: {
        onlyMine: onlyMine || undefined,
        search: search || undefined,
        docType: DOCTYPE,
      },
    };
  }

  function fetchPhotos(search) {
    setCurrentPage(1);
    if (!options.loading) {
      return fetch({
        variables: getVars(search),
      });
    }
  }

  function fetchNextPage(search) {
    if (!options.loading) {
      setCurrentPage(currentPage + 1);
      options.fetchMore({
        variables: getVars(search, currentPage * pageSize),
        updateQuery(prevResult, { fetchMoreResult }) {
          const photos = get(fetchMoreResult, "community.contents", []);
          return Object.assign({}, prevResult, {
            community: {
              __typename: 'Community',
              contents: [...prevResult.community.contents, ...photos]
            },
          });
        },
      });
    }
  }

  return [fetchPhotos, fetchNextPage, options];
}
