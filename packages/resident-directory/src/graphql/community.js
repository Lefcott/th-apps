/** @format */
import { gql } from '@teamhub/apollo-config';

export const GET_DIRECTORY_OPT_OUT_ENABLED = gql`
  query getDirectoryOptOutEnabled($communityId: NonEmptyString!) {
    community(id: $communityId) {
      settings {
        directoryOptOutEnabled
      }
    }
  }
`;

export const RESIDENT_GROUPS_LIST = gql`
  query ResidentGroups($communityId: NonEmptyString!) {
    community(id: $communityId) {
      residentGroups {
        nodes {
          _id
          name
          members {
            fullName
          }
        }
      }
      careSettings {
        _id
        name
      }
    }
  }
`;

export const CREATE_RESIDENT_GROUP = gql`
  mutation createResidentGroup(
    $communityId: NonEmptyString!
    $input: CreateResidentGroupInput!
  ) {
    community(id: $communityId) {
      createResidentGroup(input: $input) {
        residentGroup {
          _id
          name
        }
      }
    }
  }
`;

export const UPDATE_RESIDENT_GROUP = gql`
  mutation updateResidentGroup(
    $communityId: NonEmptyString!
    $input: UpdateResidentGroupInput!
  ) {
    community(id: $communityId) {
      updateResidentGroup(input: $input) {
        residentGroup {
          _id
          name
        }
      }
    }
  }
`;

export const REMOVE_RESIDENT_GROUP = gql`
  mutation removeResidentGroup(
    $communityId: NonEmptyString!
    $input: RemoveResidentGroupInput!
  ) {
    community(id: $communityId) {
      removeResidentGroup(input: $input) {
        residentGroup {
          _id
          name
        }
      }
    }
  }
`;
