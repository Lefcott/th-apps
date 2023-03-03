/** @format */

import { gql } from "@teamhub/apollo-config";

export const GET_COMMUNITY_SETTINGS = gql`
  query getCommunitySettings($communityId: NonEmptyString!) {
    community(id: $communityId) {
      settings {
        hideDeviceHistoryForOptedOutEnabled
      }
    }
  }
`;