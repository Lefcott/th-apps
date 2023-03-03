/** @format */

import { gql } from '@teamhub/apollo-config';

export const GET_RESTAURANTS = gql`
  query restaurantsForCommunity($communityId: NonEmptyString!, $first: Int!) {
    community(id: $communityId) {
      restaurants(first: $first, sort: { field: name }) {
        edges {
          cursor
          node {
            _id
            name
            careSettings {
              _id
              name
            }
            menus(first: 50) {
              edges {
                cursor
                node {
                  _id
                  availability {
                    startDate
                    endDate
                    recurrence
                  }
                  name
                  externalId
                  audiences
                  sections {
                    _id
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
        }
      }
    }
  }
`;

export const CREATE_RESTAURANT = gql`
  mutation createRestaurantForCommunity(
    $communityId: NonEmptyString!
    $input: CreateRestaurantInput!
  ) {
    community(id: $communityId) {
      createRestaurant(input: $input) {
        restaurant {
          name
          careSettings {
            _id
            name
          }
        }
      }
    }
  }
`;

export const UPDATE_RESTAURANT = gql`
  mutation updateRestaurantForCommunity(
    $communityId: NonEmptyString!
    $input: UpdateRestaurantInput!
  ) {
    community(id: $communityId) {
      updateRestaurant(input: $input) {
        restaurant {
          _id
          name
          careSettings {
            _id
            name
          }
        }
      }
    }
  }
`;

export const REMOVE_RESTAURANT = gql`
  mutation removeRestaurantForCommunity(
    $communityId: NonEmptyString!
    $input: RemoveRestaurantInput!
  ) {
    community(id: $communityId) {
      removeRestaurant(input: $input) {
        restaurant {
          _id
          name
          careSettings {
            _id
            name
          }
        }
      }
    }
  }
`;
