/** @format */

import { gql } from '@teamhub/apollo-config';

export const GET_SIGNAGE_DESTINATIONS = gql`
  query getSignageDestinations(
    $communityId: NonEmptyString!
    $playableFormats: [playableFormatFilterInput!]
  ) {
    community(id: $communityId) {
      signageDestinations(input: { playableFormats: $playableFormats }) {
        _id
        name
        playableFormats {
          _id
          name
        }
      }
    }
  }
`;
