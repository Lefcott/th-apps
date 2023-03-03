/** @format */

import { gql } from '@teamhub/apollo-config';

export const GET_INTEGRATIONS = gql`
  query getResidents($communityId: NonEmptyString!) {
    community(id: $communityId) {
      integrations {
        name
        type
        properties
      }
    }
  }
`;
