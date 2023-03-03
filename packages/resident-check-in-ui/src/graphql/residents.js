/** @format */

import { gql } from "@teamhub/apollo-config";

export const GET_AWAY_STATUSES = gql`
  query getAwayStatuses($residentId: UUID!) {
    resident(id: $residentId) {
      awayStatuses {
        id
        status
        startDate
        endDate
        reason
        notes
      }
    }
  }
`;

export const REMOVE_AWAY_STATUS = gql`
  mutation removeAwayStatus(
    $communityId: NonEmptyString!
    $id: ID!
    $residentId: UUID!
  ) {
    community(id: $communityId) {
      resident(id: $residentId) {
        removeAwayStatus(id: $id) {
          status
        }
      }
    }
  }
`;

export const ADD_AWAY_STATUS = gql`
  mutation addAwayStatus(
    $communityId: NonEmptyString!
    $residentId: UUID!
    $startDate: DateTime!
    $endDate: DateTime
    $reason: String
    $notes: String
  ) {
    community(id: $communityId) {
      resident(id: $residentId) {
        createAwayStatus(
          startDate: $startDate
          endDate: $endDate
          reason: $reason
          notes: $notes
        ) {
          status
        }
      }
    }
  }
`;

export const UPDATE_AWAY_STATUS = gql`
  mutation updateAwayStatus(
    $communityId: NonEmptyString!
    $residentId: UUID!
    $id: ID!
    $startDate: DateTime!
    $endDate: DateTime
    $reason: String
    $notes: String
  ) {
    community(id: $communityId) {
      resident(id: $residentId) {
        updateAwayStatus(
          id: $id
          startDate: $startDate
          endDate: $endDate
          reason: $reason
          notes: $notes
        ) {
          status
        }
      }
    }
  }
`;
