/** @format */

import { gql } from '@teamhub/apollo-config';

export const GET_COMMUNITY_ADDRESS_BOOK = gql`
  query GetComunityAlexaContacts($communityId: NonEmptyString!) {
    community(id: $communityId) {
      alexaAddressBook {
        contacts {
          name
          phoneNumbers
        }
      }
    }
  }
`;

export const CREATE_COMMUNITY_ALEXA_CONTACT = gql`
  mutation AddCommunityContacts(
    $communityId: NonEmptyString!
    $input: AddContactsToCommunityAddressBookInput!
  ) {
    community(id: $communityId) {
      addContactsToCommunityAddressBook(input: $input) {
        message
      }
    }
  }
`;

export const REMOVE_COMMUNITY_ALEXA_CONTACT = gql`
  mutation RemoveCommunityAlexaContact(
    $communityId: NonEmptyString!
    $input: RemoveContactFromCommunityAddressBookInput!
  ) {
    community(id: $communityId) {
      removeContactFromCommunityAddressBook(input: $input) {
        message
      }
    }
  }
`;
