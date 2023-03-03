/** @format */

import { gql } from '@teamhub/apollo-config';

export const DEFAULT_USER_FIELDS = `
  _id
  email
  firstName
  lastName
  fullName
  jobTitle
  department
  primaryPhone
  profileImage
  secondaryPhone
  publicProfile
  visibleEmail
  visiblePhone
`;

export const GET_STAFF_MEMBERS = gql`
  query getStaffMembers($communityId: NonEmptyString!) {
    community(id: $communityId) {
        staffMembers {
        ${DEFAULT_USER_FIELDS}

      }
    }
  }
`;

export const GET_STAFF_MEMBER = gql`
  query getStaffMember($staffId: UUID!) {
    staff(id: $staffId) {
        ${DEFAULT_USER_FIELDS}
    }
  }
`;

export const REMOVE_STAFF_MEMBER = gql`
  mutation archiveStaff($communityId: NonEmptyString!, $staffId: UUID!) {
    community(id: $communityId) {
      staff(id: $staffId) {
        archive(id: $staffId) {
          _id
        }
      }
    }
  }
`;

export const ADD_STAFF_MEMBER = gql`
  mutation addStaff(
    $communityId: NonEmptyString!
    $newStaffInput: StaffInput!
    $sendPasswordResetEmail: Boolean!
  ) {
    community(id: $communityId) {
      addStaff(newStaffInput: $newStaffInput, sendPasswordResetEmail: $sendPasswordResetEmail) {
        ${DEFAULT_USER_FIELDS}
      }
    }
  }
`;

export const UPDATE_STAFF_MEMBER = gql`
  mutation updateStaffMember(
    $sendPasswordResetEmail: Boolean!
    $edits: EditStaffInput
    $deletions: [RemovableUserProperty!]
    $communityId: NonEmptyString!
    $staffId: UUID!
    
  ) {
    community(id: $communityId) {
      staff(id: $staffId) {
        update(sendPasswordResetEmail: $sendPasswordResetEmail, edits: $edits, deletions: $deletions) {
          ${DEFAULT_USER_FIELDS}
        }
      }
    }
  }
`;

export const RESET_STAFF_PASSWORD = gql`
  mutation updateStaffMember(
    $communityId: NonEmptyString!,
    $staffId: UUID!
  ) {
    community(id: $communityId) {
      staff(id: $staffId) {
        update(sendPasswordResetEmail: true) {
          ${DEFAULT_USER_FIELDS}
        }
      }
    }
  }
`;

// depends on having a user exist, has to be chained with other updates
export const SET_PROFILE_IMAGE = gql`
  mutation setProfileImage(
    $communityId: NonEmptyString!
    $staffId: UUID!
    $file: Upload!
  ) {
    community(id: $communityId) {
      staff(id: $staffId) {
        setProfileImage(file: $file) {
          _id
          profileImage
        }
      }
    }
  }
`;
