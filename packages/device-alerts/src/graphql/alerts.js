import { gql } from "@teamhub/apollo-config";

/* Not sure if wanna use papi for this or not */
export const GET_DEVICE_ALERTS = gql`
  query getDeviceAlerts(
    $communityId: NonEmptyString!
    $page: CommunityDeviceAlertsPaginationArg
    $filters: AlertFilters
  ) {
    community(id: $communityId) {
      deviceAlerts(filters: $filters, page: $page) {
        pageInfo {
          cursor
          hasNextPage
        }

        alerts {
          address
          body
          timestamp
          type
          value
          room
        }
      }
    }
  }
`;
