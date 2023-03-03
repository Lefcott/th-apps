/** @format */

import { gql } from '@teamhub/apollo-config';

export const GET_RESIDENT_GROUPS = gql`
  query getResidentGroups($communityId: NonEmptyString!) {
    community(id: $communityId) {
      residentGroups {
        nodes {
          _id
          _type
          name
        }
      }
      careSettings {
        _id
        _type
        name
      }
    }
  }
`;
