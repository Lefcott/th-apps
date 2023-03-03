/** @format */

import { gql } from '@teamhub/apollo-config';

export const GET_ACTIVE_ID = gql`
  query getActiveId {
    activeId @client
  }
`;
