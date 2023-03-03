/** @format */
import { gql } from '@teamhub/apollo-config';
export const GET_EVENTS_FOR_DOWNLOAD = gql`
  query getEventsForDownload(
    $communityId: NonEmptyString!
    $calendars: [UUID!]
    $onlyPublished: Boolean
    $includePast: Boolean!
    $timeframe: EventTimeframe
    $limit: Int
    $anchoredAt: DateTime
  ) {
    community(id: $communityId) {
      timezone {
        name
      }
      events(
        calendars: $calendars
        onlyPublished: $onlyPublished
        timeframe: $timeframe
        limit: $limit
        includePast: $includePast
        anchoredAt: $anchoredAt
      ) {
        _id
        eventId
        name
        startsAt
        endsAt
        allDay
        recurring
        publishStatus
        description
        location
        calendars {
          _id
        }
      }
    }
  }
`;

export const GET_EVENTS = gql`
  query getEvents(
    $communityId: NonEmptyString!
    $calendars: [UUID!]
    $eventTypes: [Int!]
    $startDate: DateTime!
    $endDate: DateTime!
    $statuses: [PublishStatusFilters]
    $search: NonEmptyString
    $limit: Int
  ) {
    community(id: $communityId) {
      getEvents(
        calendars: $calendars
        eventTypes: $eventTypes
        statuses: $statuses
        search: $search
        startDate: $startDate
        endDate: $endDate
        limit: $limit
      ) {
        events {
          _id
          name
          eventId
          startsAt
          endsAt
          duration
          allDay
          recurring
          recurrenceInfo {
            rule
            exceptions
            statusExceptions {
              date
              status
            }
          }
          publishStatus
          description
          location
          eventLocation {
            _id
          }
          calendars {
            _id
          }
        }
        pageInfo {
          currentPage
          hasNextPage
          total
        }
      }
    }
  }
`;

// get all filters at once, rather than query individually
export const GET_FILTERS = gql`
  query getFilters($communityId: NonEmptyString!) {
    community(id: $communityId) {
      careSettings {
        _id
        name
        _type
      }
      residentGroups {
        nodes {
          _id
          name
          _type
        }
      }
      eventCalendars {
        _id
        name
        priority
        careSettings {
          _id
          name
        }
        residentGroups {
          _id
          name
          type
        }
      }
      eventTypes {
        _id
        name
        color
      }
      eventLocations {
        _id
        name
        abbr
        color
      }
    }
  }
`;

export const GET_INSTANCE_COUNT = gql`
  query getEventInstanceCount(
    $anchoredAt: DateTime!
    $communityId: NonEmptyString!
    $calendars: [UUID!]
    $includePast: Boolean
    $timeframe: EventTimeframe!
    $duration: Int
    $status: PublishStatusFilters
  ) {
    community(id: $communityId) {
      eventInstances(
        anchoredAt: $anchoredAt
        calendars: $calendars
        includePast: $includePast
        timeframe: $timeframe
        status: $status
        duration: $duration
      ) {
        pageInfo {
          total
        }
      }
    }
  }
`;

export const GET_CALENDARS = gql`
  query getCalendars($communityId: NonEmptyString!) {
    community(id: $communityId) {
      eventCalendars {
        _id
        name
        priority
      }
    }
  }
`;

// this gets a single instance right now
export const GET_EVENT = gql`
  query getEvent(
    $communityId: NonEmptyString!
    $eventId: UUID!
    $date: DateTime
  ) {
    community(id: $communityId) {
      getEvent(eventId: $eventId, date: $date) {
        _id
        eventId
        _createdAt
        _updatedAt
        name
        duration
        allDay
        recurrence
        recurrenceInfo {
          rule
          exceptions
          statusExceptions {
            date
            status
          }
        }
        openSpots
        totalSpots
        rsvps {
          _id
          displayName
          status
          recordedAt
          user {
            _id
            primaryPhone
            thumbnail
            address
          }
        }
        startsAt
        endsAt
        signupsEnd
        costsMoney
        recurring
        description
        publishStatus
        videoSource
        url
        urlDetails
        virtualEventDestinations {
          _id
          name
          playableFormats {
            _id
            name
          }
        }
        calendars {
          _id
          name
        }
        eventType {
          _id
        }
        eventLocation {
          _id
          name
        }
        calendarSettings {
          hiddenOn30
          hiddenOn7
          hiddenOn1
          noWrap
          hideEndTime
        }
      }
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation createEvent(
    $communityId: NonEmptyString!
    $event: CreateEventInput!
  ) {
    community(id: $communityId) {
      createEvent(event: $event) {
        _id
        name
        recurrence
      }
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation updateEvent(
    $communityId: NonEmptyString!
    $eventId: UUID!
    $scope: EventUpdateScope!
    $date: DateTime
    $updates: UpdateEventInput!
    $force: Boolean!
  ) {
    community(id: $communityId) {
      updateEvent(
        updates: $updates
        force: $force
        date: $date
        eventId: $eventId
        scope: $scope
      ) {
        _id
        name
      }
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation deleteEvent(
    $communityId: NonEmptyString!
    $eventId: UUID!
    $force: Boolean!
    $scope: EventUpdateScope!
    $date: DateTime
  ) {
    community(id: $communityId) {
      removeEvent(
        eventId: $eventId
        force: $force
        date: $date
        scope: $scope
      ) {
        _id
        name
      }
    }
  }
`;

// SIGNUP MUTATIONS
export const ADD_RESIDENT_SIGNUP = gql`
  mutation addResidentSignup(
    $communityId: NonEmptyString!
    $eventId: UUID!
    $userId: UUID!
    $guestName: NonEmptyString
    $date: DateTime
    $status: NonEmptyString!
  ) {
    community(id: $communityId) {
      event(id: $eventId, date: $date) {
        signup(userId: $userId, status: $status, guestName: $guestName) {
          user {
            _id

            status
            # currently the display name doesn't come back, which i think is a bug on behalf of papi
            # right now this is handled through a total event refresh
            # displayName
            recordedAt
          }
        }
      }
    }
  }
`;

export const ADD_GUEST_SIGNUP = gql`
  mutation addGuestSignup(
    $communityId: NonEmptyString!
    $eventId: UUID!
    $name: NonEmptyString!
    $date: DateTime
  ) {
    community(id: $communityId) {
      event(id: $eventId, date: $date) {
        signupGuest(guestName: $name) {
          _id
          status
          displayName
          recordedAt
        }
      }
    }
  }
`;

export const MODIFY_SIGNUP = gql`
  mutation modifySignup(
    $communityId: NonEmptyString!
    $eventId: UUID!
    $rsvpId: UUID!
    $status: RSVPStatus!
    $date: DateTime
  ) {
    community(id: $communityId) {
      event(id: $eventId, date: $date) {
        modifySignup(rsvpId: $rsvpId, status: $status) {
          _id
          # displayName isn't returned
          # displayName
          status
          recordedAt
        }
      }
    }
  }
`;

export const BULK_MODIFY_SIGNUP = gql`
  mutation modifySignup(
    $communityId: NonEmptyString!
    $eventId: UUID!
    $rsvpIds: [UUID!]!
    $status: RSVPStatus!
  ) {
    community(id: $communityId) {
      event(id: $eventId, date: $date) {
        bulkModifySignups(rsvpIds: $rsvpIds, status: $status) {
          _id
          # displayName isn't returned
          # displayName
          status
          recordedAt
        }
      }
    }
  }
`;

export const WITHDRAW_SIGNUP = gql`
  mutation widthdrawSignup(
    $communityId: NonEmptyString!
    $eventId: UUID!
    $rsvpId: UUID!
    $date: DateTime!
  ) {
    community(id: $communityId) {
      event(id: $eventId, date: $date) {
        withdraw(rsvpId: $rsvpId) {
          _id
          displayName
          status
          recordedAt
        }
      }
    }
  }
`;

export const BULK_WITHDRAW = gql`
  mutation bulkWithdraw(
    $communityId: NonEmptyString!
    $eventId: UUID!
    $date: DateTime
    $rsvpIds: [UUID!]!
  ) {
    community(id: $communityId) {
      event(id: $eventId, date: $date) {
        bulkWithdraw(rsvpIds: $rsvpIds) {
          _id
          displayName
          statusF
          recordedAt
        }
      }
    }
  }
`;

export const GET_SIGNUPS_FOR_CALENDAR = gql`
  query getSignupsForCalendar(
    $communityId: NonEmptyString!
    $calendarIds: [UUID!]!
  ) {
    community(id: $communityId) {
      eventInstances(calendars: $calendarIds) {
        events {
          name
          startsAt
          rsvps {
            user {
              firstName
              lastName
              careSettingFull {
                _id
                name
              }
              residentGroups {
                _id
                name
              }
            }
          }
          calendars {
            _id
          }
        }
      }
    }
  }
`;

export const ADD_CALENDAR = gql`
  mutation addCalendar(
    $communityId: NonEmptyString!
    $name: NonEmptyString!
    $residentGroups: [ID!]
  ) {
    community(id: $communityId) {
      calendars {
        createEventCalendar(name: $name, residentGroups: $residentGroups) {
          _id
          name
          priority
          residentGroups {
            _id
            name
            type
          }
        }
      }
    }
  }
`;

export const UPDATE_CALENDAR = gql`
  mutation updateCalendar(
    $communityId: NonEmptyString!
    $id: UUID!
    $name: NonEmptyString
    $priority: Int
    $residentGroups: [ID!]
  ) {
    community(id: $communityId) {
      calendars {
        updateEventCalendar(
          id: $id
          name: $name
          priority: $priority
          residentGroups: $residentGroups
        ) {
          _id
          name
          priority
          residentGroups {
            _id
            name
            type
          }
        }
      }
    }
  }
`;

export const REMOVE_CALENDAR = gql`
  mutation removeCalendar($communityId: NonEmptyString!, $id: UUID!) {
    community(id: $communityId) {
      calendars {
        removeEventCalendar(id: $id)
      }
    }
  }
`;

export const PREVIEW_CALENDAR = gql`
  mutation previewEventCalendar(
    $communityId: NonEmptyString!
    $calendars: [UUID!]
    $statuses: [PublishStatusFilters]
    $anchoredAt: DateTime!
    $types: [Int!]
  ) {
    community(id: $communityId) {
      calendars {
        previewEventCalendar(
          anchoredAt: $anchoredAt
          calendars: $calendars
          statuses: $statuses
          types: $types
        )
      }
    }
  }
`;

export const ADD_EVENT_TYPE = gql`
  mutation addEventType(
    $communityId: NonEmptyString!
    $name: NonEmptyString!
    $color: NonEmptyString!
  ) {
    community(id: $communityId) {
      eventAttributes {
        createEventType(name: $name, color: $color) {
          _id
          name
          color
        }
      }
    }
  }
`;

export const REMOVE_EVENT_TYPE = gql`
  mutation removeEventType($communityId: NonEmptyString!, $id: Int!) {
    community(id: $communityId) {
      eventAttributes {
        removeEventType(id: $id) {
          _id
          name
          color
        }
      }
    }
  }
`;

export const UPDATE_EVENT_TYPE = gql`
  mutation updateEventType(
    $communityId: NonEmptyString!
    $id: Int!
    $name: NonEmptyString!
    $color: NonEmptyString!
  ) {
    community(id: $communityId) {
      eventAttributes {
        updateEventType(id: $id, name: $name, color: $color) {
          _id
          name
          color
        }
      }
    }
  }
`;

export const PUBLISH_EVENTS_FOR_TIME_RANGE = gql`
  mutation publishEventsForTimeRange(
    $communityId: NonEmptyString!
    $startDate: DateTime!
    $endDate: DateTime!
    $calendars: [UUID!]!
  ) {
    community(id: $communityId) {
      publishEventsForTimeRange(
        startDate: $startDate
        endDate: $endDate
        calendars: $calendars
      ) {
        _id
        name
      }
    }
  }
`;

export const GET_LOCATIONS = gql`
  query getLocations($communityId: NonEmptyString!) {
    community(id: $communityId) {
      eventLocations {
        _id
        name
        abbr
        color
      }
    }
  }
`;

export const ADD_LOCATION = gql`
  mutation addLocation(
    $communityId: NonEmptyString!
    $name: NonEmptyString!
    $color: NonEmptyString!
    $abbr: NonEmptyString!
  ) {
    community(id: $communityId) {
      eventAttributes {
        createEventLocation(
          location: { name: $name, color: $color, abbr: $abbr }
        ) {
          _id
          name
          color
          abbr
        }
      }
    }
  }
`;

export const REMOVE_LOCATION = gql`
  mutation removeLocation($communityId: NonEmptyString!, $id: Int!) {
    community(id: $communityId) {
      eventAttributes {
        removeEventLocation(id: $id) {
          _id
          name
          color
          abbr
        }
      }
    }
  }
`;

export const UPDATE_LOCATION = gql`
  mutation updateLocation(
    $communityId: NonEmptyString!
    $id: Int!
    $name: NonEmptyString!
    $color: NonEmptyString!
    $abbr: NonEmptyString!
  ) {
    community(id: $communityId) {
      eventAttributes {
        updateEventLocation(
          id: $id
          edits: { name: $name, color: $color, abbr: $abbr }
        ) {
          _id
          name
          color
          abbr
        }
      }
    }
  }
`;

export const GET_ATTENDEES = gql`
  query getAttendees(
    $communityId: NonEmptyString!
    $eventId: UUID!
    $date: DateTime
  ) {
    community(id: $communityId) {
      getEvent(eventId: $eventId, date: $date) {
        attendees {
          _id
          displayName
          displayPhone
          user {
            _id
            thumbnail
            primaryPhone
          }
        }
      }
    }
  }
`;

export const ADD_ATTENDEE = gql`
  mutation addAttendee(
    $communityId: NonEmptyString!
    $eventId: UUID!
    $date: DateTime
    $userId: UUID!
  ) {
    community(id: $communityId) {
      event(id: $eventId, date: $date) {
        addAttendee(userId: $userId) {
          _id
          # displayName
          # displayPhone
        }
      }
    }
  }
`;

export const ADD_GUEST_ATTENDEE = gql`
  mutation addGuestAttendee(
    $communityId: NonEmptyString!
    $eventId: UUID!
    $guestPhone: PhoneNumber
    $guestEmail: NonEmptyString
    $guestName: NonEmptyString
    $date: DateTime
  ) {
    community(id: $communityId) {
      event(id: $eventId, date: $date) {
        addGuestAttendee(
          guestName: $guestName
          guestEmail: $guestEmail
          guestPhone: $guestPhone
        ) {
          _id
          # displayName
          # displayPhone
        }
      }
    }
  }
`;

export const REMOVE_ATTENDEE = gql`
  mutation removeAttendee(
    $communityId: NonEmptyString!
    $eventId: UUID!
    $_id: UUID!
    $date: DateTime
  ) {
    community(id: $communityId) {
      event(id: $eventId, date: $date) {
        removeAttendee(_id: $_id) {
          _id
        }
      }
    }
  }
`;
