/** @format */

import { gql } from '@teamhub/apollo-config';

export const GET_INVITE_CODE = gql`
  mutation getInviteCode($communityId: NonEmptyString!, $userId: UUID!) {
    community(id: $communityId) {
      user(id: $userId) {
        inviteUserWithCode {
          _id
          inviteCode
        }
      }
    }
  }
`;
