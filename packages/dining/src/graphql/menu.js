/** @format */

import { gql } from '@teamhub/apollo-config';

export const CREATE_MENU = gql`
  mutation createMenuForCommunity(
    $communityId: NonEmptyString!
    $input: CreateMenuInput!
  ) {
    community(id: $communityId) {
      createMenu(input: $input) {
        menu {
          _id
          externalId
          name
          availability {
            startDate
            endDate
            recurrence
          }
          audiences
          sections {
            name
            displayOrder
            availability {
              start
              end
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_MENU = gql`
  mutation updateMenuForCommunity(
    $communityId: NonEmptyString!
    $input: UpdateMenuInput!
  ) {
    community(id: $communityId) {
      updateMenu(input: $input) {
        menu {
          ID: _id
          externalId
          name
          availability {
            startDate
            endDate
            recurrence
          }
          audiences
          sections {
            name
            displayOrder
            availability {
              start
              end
            }
          }
        }
      }
    }
  }
`;

export const REMOVE_MENU = gql`
  mutation removeMenuForCommunity(
    $communityId: NonEmptyString!
    $input: RemoveMenuInput!
  ) {
    community(id: $communityId) {
      removeMenu(input: $input) {
        menu {
          _id
          externalId
          name
          availability {
            startDate
            endDate
            recurrence
          }
          audiences
          sections {
            name
            displayOrder
            availability {
              start
              end
            }
          }
        }
      }
    }
  }
`;
