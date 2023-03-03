/** @format */
import { gql } from '@teamhub/apollo-config';

export const GET_RESIDENTS = gql`
  query getResidents($communityId: NonEmptyString!) {
    community(id: $communityId) {
      residents {
        _id
        firstName
        lastName
        address
        building
        primaryPhone
        secondaryPhone
        email
        birthdate
        gender
        careSetting
        biography
        optOutOfDirectory
        checkin
        residentGroups {
          name
        }
      }
    }
  }
`;
