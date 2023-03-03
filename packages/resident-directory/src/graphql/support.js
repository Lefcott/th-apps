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

export const INVITE_USER_WITH_EMAIL = gql`
  mutation inviteUserWithEmail(
    $communityId: NonEmptyString!
    $userId: UUID!
    $fromResident: UUID
  ) {
    community(id: $communityId) {
      user(id: $userId) {
        inviteUserWithEmail(fromResident: $fromResident) {
          _id
          matchType
        }
      }
    }
  }
`;

export const INITIATE_RESIDENT_MOVE = gql`
  mutation initiateResidentMove(
    $communityId: NonEmptyString!
    $residentId: UUID!
    $moveInfo: MoveResidentInput!
  ) {
    community(id: $communityId) {
      resident(id: $residentId) {
        requestResidentMove(moveInfo: $moveInfo) {
          _type
          subject
          comment
        }
      }
    }
  }
`;
