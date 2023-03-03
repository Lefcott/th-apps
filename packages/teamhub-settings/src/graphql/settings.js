import { gql } from "@teamhub/apollo-config";

/* Not sure if wanna use papi for this or not */
export const UPSERT_SETTINGS = gql`
  mutation upsertCommunitySettings(
    $communityId: NonEmptyString!
    $settings: CommunitySettingsInput!
  ) {
    community(id: $communityId) {
      settings {
        upsertSettings(settings: $settings) {
          deviceAlerts {
            highTempAlertEnabled
            highTempAlertThreshold
            lowTempAlertEnabled
            lowTempAlertThreshold
            ovenAlertEnabled
            ovenAlertDurationThreshold
            leakAlertEnabled
            alertNotificationEnabled
            alertNotificationPhoneNumbers
          }
        }
      }
    }
  }
`;

export const GET_RCI_SETTINGS = gql`
  query getCommunityCheckinSettings($communityId: NonEmptyString!) {
    community(id: $communityId) {
      timezone {
        name
        displayName
        abbrs
        localized {
          abbr
          offset
          clockTime
          startsAt
          endsAt
        }
      }
      checkin {
        emailSchedules {
          window {
            start
            end
          }
          notifications {
            recipients
            time
            enabled
          }
        }
      }
    }
  }
`;

export const UPSERT_RCI_SETTINGS = gql`
  mutation updateEmailSchedules(
    $communityId: NonEmptyString!
    $input: UpdateCheckinEmailSchedulesInput!
  ) {
    community(id: $communityId) {
      updateCheckinEmailSchedules(input: $input) {
        emailSchedules {
          window {
            start
            end
          }
          notifications {
            recipients
            time
            enabled
          }
        }
      }
    }
  }
`;
