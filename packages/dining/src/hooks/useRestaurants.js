/** @format */

import { GET_RESTAURANTS } from '../graphql/restaurant';
import { useQuery } from '@teamhub/apollo-config';
import { get, cloneDeep } from 'lodash';
import { getCommunityId } from '@teamhub/api';

export default function useRestaurants() {
  const communityId = getCommunityId();
  const { data, loading, error, refetch } = useQuery(GET_RESTAURANTS, {
    nextFetchPolicy: 'network-only',
    variables: {
      communityId,
      first: 50,
    },
  });

  const items = get(data, 'community.restaurants.edges', []);

  const restaurants = items.map((item) => {
    const copy = cloneDeep(item.node);
    copy.menus = copy.menus.edges.map(({ node }) => {
      node.restaurant = item.node;
      return node;
    });
    return copy;
  });

  return [restaurants, { loading: loading, error, refetch }];
}
