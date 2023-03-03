import gql from "graphql-tag";

export const GET_CONTENT = gql`
  query getContent($communityId: NonEmptyString!, $documentId: UUID!) {
    community(id: $communityId) {
      content(id: $documentId) {
        ... on Design {
          rendered
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
