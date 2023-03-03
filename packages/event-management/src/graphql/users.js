/** @format */

import { gql } from '@teamhub/apollo-config';

export const GET_USERS = gql`
  query getUsers($communityId: NonEmptyString!, $filters: UserFilterOptions) {
    community(id: $communityId) {
      residents(filters: $filters) {
        _id
        fullName
      }
    }
  }
`;
