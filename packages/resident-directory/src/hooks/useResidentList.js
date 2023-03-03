/** @format */

import { get } from 'lodash';
import { getCommunityId } from '@teamhub/api';
import { useQuery } from '@teamhub/apollo-config';
import { useFilters } from '../components/FilterProvider';
import { GET_RESIDENTS } from '../graphql/users';
import useFilter from '../hooks/useFilter';

const useResidentList = () => {
  const communityId = getCommunityId();
  const { loading, error, data, refetch } = useQuery(GET_RESIDENTS, {
    variables: { communityId },
  });
  const [{ search, careSettings }] = useFilters();
  // we are concerned with filtering on name and address, and care setting
  const filteredList = useFilter(
    { searchTerm: search, careSettings },
    !loading && get(data, 'community.residents'),
    ['fullName', 'address'],
    loading,
  );

  return {
    residents: filteredList,
    loading,
    error,
    refetch,
  };
};

export default useResidentList;
