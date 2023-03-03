import { gql } from '@teamhub/apollo-config';

export const GET_CONTENTS = gql`
  query getContents(
    $communityId: NonEmptyString!
    $page: CommunityContentsPaginationArg
    $filters: ContentFilterOptions
  ) {
    community(id: $communityId) {
      contents(page: $page, filters: $filters) {
        _id
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

export const GET_ALL_CONTENT_TYPES = gql`
  query getContents(
    $communityId: NonEmptyString!
    $page: CommunityContentsPaginationArg
    $onlyMine: Boolean
  ) {
    community(id: $communityId) {
      designs: contents(
        page: $page
        filters: { onlyMine: $onlyMine, docType: design }
      ) {
        _id
        created
        name
        docType
        url
        ... on Design {
          images
          dimensions
          units
        }
      }
      photos: contents(
        page: $page
        filters: { onlyMine: $onlyMine, docType: photo }
      ) {
        _id
        created
        name
        docType
        url
      }
      documents: contents(
        page: $page
        filters: { onlyMine: $onlyMine, docType: document }
      ) {
        _id
        created
        name
        docType
        url
        ... on Document {
          images
        }
      }
    }
  }
`;

export const GET_SINGLE_CONTENT = gql`
  query getSingleContent($communityId: NonEmptyString!, $id: UUID!) {
    community(id: $communityId) {
      content(id: $id) {
        _id
        name
        ... on Design {
          orientation
          template
          originalDocumentType
          originalDocumentOrientation
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
        url
        name
      }
    }
  }
`;

export const CREATE_DESIGN = gql`
  mutation createDesign(
    $communityId: NonEmptyString!
    $input: CreateDesignInput!
  ) {
    community(id: $communityId) {
      createDesign(input: $input) {
        _id
        name

        ... on Design {
          template
          originalDocumentType
          originalDocumentOrientation
        }
      }
    }
  }
`;

export const RENAME_CONTENT = gql`
  mutation renameContent(
    $communityId: NonEmptyString!
    $contentId: UUID!
    $name: NonEmptyString!
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

export const DELETE_CONTENT = gql`
  mutation deleteContent($communityId: NonEmptyString!, $contentId: UUID!) {
    community(id: $communityId) {
      content(id: $contentId) {
        delete {
          _id
        }
      }
    }
  }
`;

export const PRINT_CONTENT = gql`
  mutation printContent($communityId: NonEmptyString!, $contentId: UUID!) {
    community(id: $communityId) {
      content(id: $contentId) {
        print
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
