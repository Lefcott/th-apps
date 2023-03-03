import { gql } from "@teamhub/apollo-config";

export const GET_MEDIA_SETTINGS = gql`
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

export const UPDATE_MEDIA_SETTINGS = gql`
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
