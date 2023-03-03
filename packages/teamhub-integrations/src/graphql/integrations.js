import { gql } from "@teamhub/apollo-config";

export const GET_INTEGRATIONS = gql`
  query getResidents($communityId: NonEmptyString!) {
    community(id: $communityId) {
      integrations {
        name
        type
        properties
      }
    }
  }
`;

export const GET_YOUTUBE_INTEGRATION = gql`
  query getMediaSettings($communityId: NonEmptyString!) {
    community(id: $communityId) {
      _id
      mediaSettings {
        youtubePlaylistId
        youtubePlaylistUrl
      }
    }
  }
`;

export const UPDATE_YOUTUBE_INTEGRATION = gql`
  mutation updateMediaSettings(
    $communityId: NonEmptyString!
    $youtubePlaylistUrl: URL
    $youtubePlaylistId: NonEmptyString
  ) {
    community(id: $communityId) {
      updateMediaSettings(
        youtubePlaylistUrl: $youtubePlaylistUrl
        youtubePlaylistId: $youtubePlaylistId
      ) {
        youtubePlaylistId
        youtubePlaylistUrl
      }
    }
  }
`;
