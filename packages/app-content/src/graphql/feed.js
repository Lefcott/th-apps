/** @format */

import { gql } from '@teamhub/apollo-config';

export const GET_FEED_ITEM = gql`
  query getFeedItem($communityId: NonEmptyString!, $feedItemId: UUID!) {
    community(id: $communityId) {
      feedItem(id: $feedItemId) {
        _id
        title
        body
        author
        category
        audiences
        tags
        residentGroups
        assets {
          name
          contentId
          type
          url
          details
          preview
        }
        startDate
        endDate
      }
      notification(resourceId: $feedItemId) {
        _id
        resourceId
        title
        body
        startDate
        deleted
        sentAt
      }
    }
  }
`;
export const GET_FEED = gql`
  query getFeedItems(
    $communityId: NonEmptyString!
    $page: FeedPageInput
    $filters: FeedFilters
  ) {
    community(id: $communityId) {
      feed(page: $page, filters: $filters) {
        posts {
          _id
          title
          author
          body
          category
          audiences
          tags
          startDate
          endDate
          assets {
            name
            type
            url
            details
            contentId
          }
        }
        pageInfo {
          currentPage
          lastPage
          hasNextPage
          total
        }
      }
    }
  }
`;

export const PUBLISH_TO_FEED = gql`
  mutation publishToFeed(
    $communityId: NonEmptyString!
    $input: PublishToFeedInput!
  ) {
    community(id: $communityId) {
      publish(input: $input) {
        _id
        title
        author
        body
        category
        audiences
        tags
        startDate
        endDate
        residentGroups
        assets {
          name
          type
          url
          details
        }
      }
    }
  }
`;

export const GET_TAGS = gql`
  query getTags($communityId: NonEmptyString!, $input: TagQueryInput!) {
    community(id: $communityId) {
      tags(input: $input)
    }
  }
`;

export const END_POST = gql`
  mutation endPost($communityId: NonEmptyString!, $postId: UUID!) {
    community(id: $communityId) {
      post(id: $postId) {
        end {
          _id
        }
      }
    }
  }
`;

export const UPDATE_POST = gql`
  mutation updatePost(
    $communityId: NonEmptyString!
    $editPostInput: EditPostInput!
    $postId: UUID!
  ) {
    community(id: $communityId) {
      post(id: $postId) {
        edit(input: $editPostInput) {
          _id
          _createdAt
          _updatedAt
          _updatedBy
          title
          category
          author
          tags
          audiences
          body
          startDate
          endDate
          recurrence
        }
      }
    }
  }
`;

export const UPDATE_POST_ASSETS = gql`
  mutation updatePost(
    $communityId: NonEmptyString!
    $editAssetsInput: EditAssetsInput!
    $postId: UUID!
  ) {
    community(id: $communityId) {
      post(id: $postId) {
        editAssets(input: $editAssetsInput) {
          _id
          _createdAt
          _updatedAt
          _updatedBy
          title
          category
          author
          tags
          audiences
          body
          startDate
          endDate
          recurrence
          assets {
            name
            type
            url
            details
          }
        }
      }
    }
  }
`;

export const CREATE_NOTIFICATION = gql`
  mutation createNotification(
    $communityId: NonEmptyString!
    $createNotificationInput: CreateAssocNotificationInput!
  ) {
    community(id: $communityId) {
      createAssocNotification(input: $createNotificationInput) {
        _id
        resourceId
        title
        body
        startDate
        deleted
      }
    }
  }
`;

export const UPDATE_NOTIFICATION = gql`
  mutation updateNotification(
    $communityId: NonEmptyString!
    $updateNotificationInput: UpdateNotificationInput!
  ) {
    community(id: $communityId) {
      updateNotification(input: $updateNotificationInput) {
        _id
        resourceId
        title
        body
        startDate
        deleted
      }
    }
  }
`;

export const GET_NOTIFICATION = gql`
  query getNotification($communityId: NonEmptyString!, $resourceId: UUID!) {
    community(id: $communityId) {
      _id
      notification(resourceId: $resourceId) {
        _id
        resourceId
        title
        body
        startDate
        deleted
      }
    }
  }
`;
