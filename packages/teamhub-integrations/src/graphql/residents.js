import { gql } from "@teamhub/apollo-config";

export const GET_RESIDENTS_WITH_POS_MATCHES = gql`
  query getResidents(
    $communityId: NonEmptyString!
    $withPotentialMatches: Boolean = true
  ) {
    community(id: $communityId) {
      integrationPotentialMatches @include(if: $withPotentialMatches) {
        matchedUserGuid
        vendorIdKey
        vendorId
        vendorProperties {
          firstName
          lastName
          fullName
          email
          primaryPhone
          roomNumber
        }
      }
      residents {
        _id
        thumbnail
        fullName
        firstName
        lastName
        email
        primaryPhone
        secondaryPhone
        address
        posIdentifier
      }
    }
  }
`;

export const LINK_RES_TO_POS = gql`
  mutation linkResToPos(
    $communityId: NonEmptyString!
    $residentId: UUID!
    $vendorId: NonEmptyString!
    $vendorIdKey: NonEmptyString!
  ) {
    community(id: $communityId) {
      user(id: $residentId) {
        confirmUserMatch(vendorId: $vendorId, vendorIdKey: $vendorIdKey) {
          _id
          fullName
          firstName
          lastName
          email
          primaryPhone
          ... on Resident {
            secondaryPhone
            address
            posIdentifier
            thumbnail
          }
        }
      }
    }
  }
`;

export const UNLINK_RESIDENT = gql`
  mutation removeLink(
    $communityId: NonEmptyString!
    $residentId: UUID!
    $vendorIdKey: NonEmptyString!
  ) {
    community(id: $communityId) {
      user(id: $residentId) {
        unlinkUser(vendorIdKey: $vendorIdKey) {
          _id
          fullName
          firstName
          lastName
          email
          primaryPhone
          ... on Resident {
            secondaryPhone
            address
            posIdentifier
            thumbnail
          }
        }
      }
    }
  }
`;
