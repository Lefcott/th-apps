/** @format */
import { gql } from '@teamhub/apollo-config';

// right now im not supplying pagination args
// but we can do that in the residents part of the query
// could turn this into a fragment
export const DEFAULT_USER_FIELDS = `
  _id
  firstName
  lastName
  fullName
`;

export const GET_RESIDENTS = gql`
  query getResidents($communityId: NonEmptyString!, $skipResidentGroupFields: Boolean! = false) {
    community(id: $communityId) {
      residents {
        ${DEFAULT_USER_FIELDS}
        moveRoomPending
        careSetting
        profileImage
        thumbnail
        address
        residentGroups @skip(if: $skipResidentGroupFields) {
          _id
          name
        } 
      }
    }
  }
`;

export const GET_CONTACTS = gql`
  query getContacts($residentId: UUID!) {
    resident(id: $residentId) {
      contacts {
        ${DEFAULT_USER_FIELDS}
        email
        primaryPhone
        relationship
      }
    }
  }
`;

export const GET_LINKED_RESIDENTS = gql`
  query getLinkedResidents($communityId: NonEmptyString!, $filters: UserFilterOptions) {
    community(id: $communityId) {
      residents(filters: $filters) {
        ${DEFAULT_USER_FIELDS}
        profileImage
        linkedResident {
          ${DEFAULT_USER_FIELDS}
        }
      }
    }
  }
`;

export const GET_RESIDENT = gql`
  query getSingleResident($id: UUID!, $communityId: ID) {
    resident(id: $id, communityId: $communityId) {
      ${DEFAULT_USER_FIELDS}
      biography
      address
      profileImage
      primaryPhone
      secondaryPhone
      email
      building
      gender
      checkin
      moveRoomPending
      birthdate
      moveInDate
      residenceType
      careSetting
      rooms {
        name
      }
			residentGroups {
				_id
				name
			}
      optOutOfDirectory
      linkedResident {
        ${DEFAULT_USER_FIELDS}
      }
      contacts {
        ${DEFAULT_USER_FIELDS}
        email
        relationship
        primaryPhone
      }
      alexaAddressBook {
        contacts {
          contactId
          name
          phoneNumbers
          type
        }
      }
    }
  }
`;

export const ADD_RESIDENT = gql`
  mutation addResident($newResidentInput: ResidentInput!, $communityId: NonEmptyString!) {
    community(id: $communityId) {
      addResident(newResidentInput: $newResidentInput, createSupportTicket: true) {
        ${DEFAULT_USER_FIELDS}
        address
        profileImage
        primaryPhone
        secondaryPhone
        email
        building
        gender
        checkin
        birthdate
        moveInDate
        residenceType
        careSetting
        thumbnail
        moveRoomPending
        contacts {
          ${DEFAULT_USER_FIELDS}
          email
          relationship
          primaryPhone
        }
      }
    }
  }
`;

export const UPDATE_RESIDENT = gql`
  mutation updateResident($edits: EditResidentInput, $communityId: NonEmptyString!, $residentId: UUID!, $deletions: [RemovableUserProperty!]) {
    community(id: $communityId) {
      resident(id: $residentId) {
        update(edits: $edits, deletions: $deletions) {
          ${DEFAULT_USER_FIELDS}
          address
          profileImage
          primaryPhone
          gender
          secondaryPhone
          email
          checkin
          birthdate
          building
          moveInDate
          residenceType
          careSetting
          moveRoomPending
          thumbnail
          optOutOfDirectory
          contacts {
            ${DEFAULT_USER_FIELDS}
            email
            isPrimaryContact
            relationship
            primaryPhone
          }
        }
      }
    }
  }
`;

//CONTACTS
export const ADD_CONTACT = gql`
  mutation addContactForResident($communityId: NonEmptyString!, $residentId: UUID!, $newContact: NewContactInput!) {
    community(id: $communityId) {
      resident(id: $residentId) {
        addContact(newContactInput: $newContact) {
          ${DEFAULT_USER_FIELDS}
          email
          relationship
          primaryPhone
          isPrimaryContact
        }
      }
    }
  }
`;

export const REMOVE_CONTACT = gql`
  mutation removeContactForResident($communityId: NonEmptyString!, $residentId: UUID!, $contactId: UUID!) {
    community(id: $communityId) {
      resident(id: $residentId) {
        removeContact(userId: $contactId) {
          ${DEFAULT_USER_FIELDS}
        }
      }
   }
  }
`;

export const EDIT_CONTACT = gql`
  mutation editContactForResident(
    $communityId: NonEmptyString!
    $residentId: UUID!
    $contactId: UUID!
    $contact: EditContactInput!
  ) {
    community(id: $communityId) {
      resident(id: $residentId) {
        contact(id: $contactId) {
          update(properties: $contact) {
            ${DEFAULT_USER_FIELDS}
            email
            relationship
            primaryPhone
            isPrimaryContact
          }
        }
      }
    }
  }
`;

export const MERGE_CONTACTS = gql`
  mutation mergeContactForResident($communityId: NonEmptyString!, $residentId: UUID!, $mergeResidentId: UUID!) {
    community(id: $communityId) {
      resident(id: $residentId) {
        mergeContacts(userId: $mergeResidentId) {
          ${DEFAULT_USER_FIELDS}
          email
          primaryPhone
          fields
          linkedResident {
            ${DEFAULT_USER_FIELDS}
          }
        }
      }
    }
  }
`;

export const UPLOAD_PROFILE_IMAGE = gql`
  mutation changeProfileImage(
    $file: Upload!
    $communityId: NonEmptyString!
    $residentId: UUID!
  ) {
    community(id: $communityId) {
      resident(id: $residentId) {
        setProfileImage(file: $file) {
          _id
          thumbnail
          profileImage
        }
      }
    }
  }
`;

export const INVITE_USER = gql`
  mutation inviteUser($communityId: NonEmptyString!, $id: UUID!) {
    community(id: $communityId) {
      user(id: $id) {
        inviteUserWithEmail {
          _id
          matchType
        }
      }
    }
  }
`;

export const ADD_RESIDENT_TO_RESIDENT_GROUP = gql`
  mutation addResidentToResidentGroup(
    $communityId: NonEmptyString!
    $input: AddResidentToResidentGroupsInput!
  ) {
    community(id: $communityId) {
      addResidentToResidentGroups(input: $input) {
        message
      }
    }
  }
`;

export const REMOVE_RESIDENT_FROM_GROUP = gql`
  mutation removeResidentFromGroup(
    $communityId: NonEmptyString!
    $input: RemoveResidentFromResidentGroupsInput!
  ) {
    community(id: $communityId) {
      removeResidentFromResidentGroups(input: $input) {
        message
      }
    }
  }
`;

export const ADD_CONTACTS_TO_PERSONAL_ADDRESS_BOOK = gql`
  mutation addContactsToPersonalAdressBook(
    $communityId: NonEmptyString!
    $input: AddContactsToPersonalAddressBookInput!
  ) {
    community(id: $communityId) {
      addContactsToPersonalAddressBook(input: $input) {
        message
      }
    }
  }
`;
