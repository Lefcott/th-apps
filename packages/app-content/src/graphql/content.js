/** @format */

import { gql } from '@teamhub/apollo-config';

export const GET_TIMEZONE = gql`
  query getTimezone($communityId: NonEmptyString!) {
    community(id: $communityId) {
      timezone {
        name
      }
    }
  }
`;

export const GET_CONTENT = gql`
  query getContent($communityId: NonEmptyString!, $id: UUID!) {
    community(id: $communityId) {
      content(id: $id) {
        _id
        __typename
        created
        name
        docType
        url
        ... on Document {
          images
        }
        ... on Design {
          images
          dimensions
          units
        }
      }
    }
  }
`;

export const GET_CONTENTS = gql`
  query getContents(
    $communityId: NonEmptyString!
    $page: CommunityContentsPaginationArg
    $filters: ContentFilterOptions
  ) {
    community(id: $communityId) {
      contents(page: $page, filters: $filters) {
        _id
        name
        ... on Design {
          images
          url
        }
      }
    }
  }
`;

export const RENAME = gql`
  mutation renameDocument(
    $communityId: NonEmptyString!
    $name: NonEmptyString!
    $contentId: UUID!
  ) {
    community(id: $communityId) {
      content(id: $contentId) {
        rename(name: $name) {
          _id
          name
        }
      }
    }
  }
`;

export const GET_FOLDERS = gql`
  query getFolders(
    $communityId: NonEmptyString!
    $app: K4AppType!
    $folders: [FolderType!]!
  ) {
    community(id: $communityId) {
      app(type: $app) {
        folders(types: $folders) {
          _id
          name
          type
        }
      }
    }
  }
`;

export const CREATE_UPLOAD = gql`
  mutation createUpload($communityId: NonEmptyString!, $files: [FileUpload!]!) {
    community(id: $communityId) {
      getUploadUrl(files: $files) {
        _id
        name
        url
      }
    }
  }
`;

export const CREATE_FOLDER = gql`
  mutation createFolder(
    $communityId: NonEmptyString!
    $appType: K4AppType!
    $input: CreateFolderInput!
  ) {
    community(id: $communityId) {
      app(type: $appType) {
        createFolder(input: $input) {
          _id
          type
        }
      }
    }
  }
`;

export const PUBLISH_CONTENT = gql`
  mutation publishContent(
    $communityId: NonEmptyString!
    $appType: K4AppType!
    $input: PublishToAppInput
  ) {
    community(id: $communityId) {
      app(type: $appType) {
        publish(input: $input) {
          status
        }
      }
    }
  }
`;

export const CONTENT_CREATED = gql`
  subscription contentCreated(
    $communityId: NonEmptyString!
    $docType: [DocType!]
    $owner: UUID
  ) {
    contentCreated(
      communityId: $communityId
      docType: $docType
      owner: $owner
    ) {
      _id
      __typename
      created
      name
      docType
      url
      ... on Document {
        images
      }
      ... on Design {
        images
        dimensions
        units
      }
    }
  }
`;
