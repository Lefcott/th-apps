/** @format */

import { gql } from '@teamhub/apollo-config';

export const GET_MENU_ITEM_CATEGORIES_ATTRIBUTES = gql`
  query categoriesAndAttributesForCommunity(
    $communityId: NonEmptyString!
    $firstAttributes: Int!
  ) {
    community(id: $communityId) {
      diningAttributes(first: $firstAttributes) {
        edges {
          cursor
          node {
            _id
            value
          }
        }
      }
      diningCategories {
        _id
        name
        displayOrder
      }
    }
  }
`;

export const GET_MENU_ITEMS = gql`
  query menuItemsForCommunity(
    $communityId: NonEmptyString!
    $search: NonEmptyString
    $first: Int!
    $after: String
  ) {
    community(id: $communityId) {
      diningItems(search: $search, first: $first, after: $after) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            __typename
            _id
            name
            description
            category {
              _id
              name
            }
            attributes {
              _id
              value
            }
          }
        }
      }
    }
  }
`;

export const GET_SAME_MENU_ITEM = gql`
  query sameMenuItemForCommunity(
    $communityId: NonEmptyString!
    $search: NonEmptyString
  ) {
    community(id: $communityId) {
      diningItems(search: $search, first: 1) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            __typename
            _id
            name
            description
            category {
              _id
              name
            }
            attributes {
              _id
              value
            }
          }
        }
      }
    }
  }
`;

export const GET_AVAILABLE_MENU_ITEM = gql`
  query getAvailableMenuItem(
    $communityId: NonEmptyString!
    $restaurantId: ID!
    $menuId: ID!
    $anchorDate: DateTime
  ) {
    community(id: $communityId) {
      restaurant(id: $restaurantId) {
        menu(id: $menuId) {
          _id
          name
          sections {
            _id
            name
            availableMenuItems(timeframe: Week, anchorDate: $anchorDate) {
              _id
              name
              description
              availability {
                dayActive
              }
              category {
                _id
                name
              }
              attributes {
                _id
                value
              }
              createdAt
              diningItemId
            }
          }
        }
      }
    }
  }
`;

export const CREATE_MENU_ITEM = gql`
  mutation createMenuItemForCommunity(
    $communityId: NonEmptyString!
    $input: CreateDiningItemInput!
  ) {
    community(id: $communityId) {
      createDiningItem(input: $input) {
        diningItem {
          _id
          name
          description
          attributes {
            _id
            value
          }
          category {
            _id
            name
          }
        }
      }
    }
  }
`;

export const ADD_ITEM_TO_MENU = gql`
  mutation addItemToMenu(
    $communityId: NonEmptyString!
    $input: AddItemToMenuInput!
  ) {
    community(id: $communityId) {
      addItemToMenu(input: $input) {
        menuItems {
          _id
          name
          description
          category {
            _id
            name
          }
          attributes {
            _id
            value
          }
        }
      }
    }
  }
`;

export const REMOVE_ITEM_TO_MENU = gql`
  mutation removeMenuItem(
    $communityId: NonEmptyString!
    $input: RemoveItemFromMenuInput!
  ) {
    community(id: $communityId) {
      removeItemFromMenu(input: $input) {
        removedMenuItem {
          _id
          name
        }
      }
    }
  }
`;

export const UPDATE_MENU_ITEM = gql`
  mutation updateDiningItem(
    $communityId: NonEmptyString!
    $input: UpdateDiningItemInput!
  ) {
    community(id: $communityId) {
      updateDiningItem(input: $input) {
        diningItem {
          _id
          name
          description
          category {
            _id
            name
          }
          attributes {
            _id
            value
          }
        }
      }
    }
  }
`;
