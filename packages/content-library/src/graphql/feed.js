import { gql } from '@teamhub/apollo-config';

export const GET_POSTS_BY_CONTENT_ID = gql`
  query getPostsByContentId(
    $communityId: NonEmptyString!
    $contentIds: [UUID!]!
  ) {
    community(id: $communityId) {
      feedItemsByContentId(contentIds: $contentIds) {
        _id
        title
        audiences
        startDate
      }
    }
  }
`;
