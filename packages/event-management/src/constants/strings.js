/** @format */

export default {
  loading: 'Loading...',
  Calendar: {
    open: 'events_settings_calendar',
    search: 'events_calendar_search',
    save: 'Eventmanager_calendar_save',
    cancel: 'Eventmanager_calendar_cancel',
    delete: 'events_calendar_delete_confirm',
    residentGroup: 'Resident Group',
    careSetting: 'Care Setting',
    residentGroups: 'Resident Groups',
    careSettings: 'Care Settings',
    downloadEvent: 'Download Event List to Word',
    downloading: 'Downloading...',
    download: 'Download',
  },
  CalendarPreview: {
    gettingPreviewReady: 'Getting your preview ready...',
    previewMonthlyCalendar: 'Preview Monthly Calendar',
    draft: 'You cannot preview only draft events.',
    archived: 'You cannot preview archived events.',
    selectCalendar: 'You must select at least one calendar to preview.',
  },
  Download: {
    downloadEvent: 'Download Event List to Word',
    downloading: 'Downloading...',
    download: 'Download',
    preview: {
      title: 'Example',
      dayOfWeek: 'Monday,',
      date: 'May 21',
      startTime: (period) => `10:00${period ? 'AM' : ''}`,
      endTime: (period) => `-2:00${period ? 'PM' : ''}`,
      eventName: 'Event Name',
      location: '(LOC)',
      description:
        'This is an example of what an event will look like once exported.',
    },
  },
  Buttons: {
    cancel: 'Cancel',
    save: 'Save',
    download: 'Download',
    publishAll: 'Publish Events',
    publish: 'Publish',
    newEvent: 'New Event',
    done: 'Done',
    delete: 'Delete',
    archive: 'Archive',
    print: 'Print',
    add: 'Add',
    addToSignups: 'Add To Signups',
    addToWaitlist: 'Add to Waitlist',
    ok: 'Ok',
    confirm: 'Confirm',
  },
  confirmation: {
    yes: 'Yes',
    no: 'No',
  },
  Attendance: {
    markAsPresent: 'Swipe left to mark people present',
    remove: 'Swipe right to remove',
    addResidentSuccess: 'You successfully added a resident',
    addGuestSuccess: 'You successfully added a guest',
    addAllSignupsSuccess: 'You successfully added all signups',
    alreadyListedAsAttending: (name) =>
      `${name} is already listed as attending`,
    phoneInvalid: (phone) =>
      `${phone} is not a valid phone number, please enter a valid phone number`,
    removeAttendeeSuccess: 'You successfully removed an attendee',
    labels: {
      name: 'Name',
      signups: 'Sign-ups',
      attendees: 'Attendees',
      addAttendee: 'Add Attendee',
      costsMoney: 'Costs Money',
      phone: 'Phone',
      resident: 'Resident',
      guest: 'Guest',
      residentGuest: 'Resident and Guest',
      addResident: 'Add Resident',
      addGuest: 'Add Guest',
      removeGuest: 'Remove Guest',
    },
    signups: {
      imported: 'Imported Sign-Ups',
      clickToMarkPresent:
        'Are they here? Click on the resident to mark them as present. ',
      markAllAsAttended: 'MARK ALL AS ATTENDED',
      allInAttendance: 'All signups in attendance',
      title: 'Signups',
      waitlist: 'Waitlist',
      waitlists: 'Waitlists',
      both: 'Both',
      signup: 'Sign Up',
      modalTitle: 'Event Sign Up',
      moveSuccess: (name, type) =>
        `You've successfully moved ${name} to the ${
          type === 'waitlist' ? 'signups list' : 'waitlist'
        }`,
      withdrawnSuccess: (name) => `You've successfully withdrawn ${name}`,
      moveTo: 'Move to ',
      removeFrom: 'Remove from ',
      noPhoneNumber: 'No Phone Number',
    },
    errors: {
      requiredResident: 'Please select a resident',
      requiredGuest: 'Please enter a guest name',
      residentGuestSame: "Resident and guest can't be the same",
    },
    tables: {
      columns: {
        name: 'Name',
        phone: 'Phone',
        dateTime: 'Date & Time',
        address: 'Address',
      },
    },
    attendees: {
      title: 'Attendees',
      present: 'People you mark as present will show up here.',
      add: 'Add Attendee',
    },
  },
  Settings: {
    title: 'Settings',
    backToCalendar: 'Back to calendar',
    openFilters: 'Open Filters/Settings',
  },
  CalendarTable: {
    title: 'Calendars',
    validations: {
      name: 'Name is required',
    },
    inputs: {
      name: 'Name',
      residentGroupHelperText: (group) => `Please select a ${group}`,
    },
    careSettingsConfirmation: {
      change: (groups) => `Change ${groups}?`,
      someRemaining: (length, groups, plural) =>
        `There are ${length} residents signed up for events occuring on this calendar who are in the following ${groups}${plural}:`,
      oneRemaining: (length, groups, plural) =>
        `There is ${length} resident signed up for events occuring on this calendar who is in the following  ${groups}${plural}:`,
      theseWillRemainSignedUp:
        'These residents will remain signed up for these events.',
      thisWillRemainSignedUp:
        'This resident will remain signed up for these events.',
      willNotBeNotified: (residentsAmmount) =>
        `To remove ${
          residentsAmmount > 1 ? 'these residents,' : 'this resident,'
        } edit the event sign-up list (resident${
          residentsAmmount > 1
            ? 's will not be notified if they are removed)'
            : ' will not be notified if he is removed)'
        }`,
    },
    deleteConfirmation: 'Are you sure you want to delete this Calendar?',
  },
  EventTypeTable: {
    columns: {
      name: 'Name',
      color: 'Color',
    },
    deleteConfirmation: 'Are you sure you want to delete this Event Type?',
  },
  LocationTable: {
    columns: {
      name: 'Name',
      abbreviation: 'Abbreviation',
      color: 'Color',
    },
    validations: {
      abbreviation: 'Abbreviation is required',
    },
    deleteConfirmation: 'Are you sure you want to delete this Location?',
  },
  Publish: {
    selectDate:
      'Select a date range to publish events occurring within those dates.',
    publishEvents: 'Publish Events',
    noEventsAdded: 'There have been no events added during this time period.',
    allEventsPublished:
      'All events occurring within these dates have been published.',
    oneEventWillBePublished: '1 event will be published.',
    manyEventsWillBePublished: (eventCount) =>
      `${eventCount} events will be published.`,
    eventsPublishedSuccess: 'Your events were successfully published',
  },
  Event: {
    title: 'Event Information',
    removeSelectedLocation: 'Remove selected location',
    select: 'select',
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
    saveAndAdd: 'Create another event',
    actions: {
      publish: 'Publish',
      saveDraft: 'Save as Draft',
      deleteEvent: 'Delete Event',
      deleteSeries: 'Delete Series',
      archiveEvent: 'Archive Event',
      archiveSeries: 'Archive Series',
    },
    editSuccess: (name) => `${name} was successfully edited`,
    createSuccess: (name) => `${name} was successfully created`,
    virtual: 'Virtual Event',
    virtualEventTooltip:
      'Virtual events can include virtual meetings, live streams, pre-recorded videos, etc.',
    showOnTV: 'Show On TV Channel',
    showOnTVTooltip:
      'Repeating events cannot be shown on TV. To show on TV, remove the repeat option under Event Scheduling.',
    communityLabel:
      "If your community has K4Community Plus, this video will appear in the Events section.\n If your community has K4Community Direct Broadcast, this video will play on the TV Channel.\n Don't have K4Community Plus or Direct Broadcast?",
    communityUpgrade: 'Learn how to upgrade',
    learnMore: 'Learn more about supported video links and get help on the',
    directBreadcastSupport: 'Direct Broadcast support page',
    dvdLabel: 'DVD will play on the TV Channel, but not on K4Community Plus.',
    linkError: 'preview information not available',
    invalidLink: 'This is not a valid link',
    videoHelperText:
      'Regardless of the event End Time, the DVD will play for its entire duration and then switch back to the slideshows published from the Digital Signage Manager.',
    noMatchingEvents: 'No Matching Events',
    allDay: 'All Day',
    changeDateOrTime:
      'Changing the time or date of this event will remove the RSVPs.',
    cannotUndo: 'You cannot undo this action.',
    inputs: {
      name: 'Event Name',
      description: 'Description',
      location: 'Location',
      status: 'Event Status',
      calendars: 'Calendars',
      allCalendars: 'All Calendars',
      tvChannel: 'TV Channel',
      videoSource: 'Video Source',
      link: 'Link',
      startDate: 'Start Date',
      endDate: 'End Date',
      startTime: 'Start Time',
      endTime: 'End Time',
      allDay: 'All Day',
      repeatOptions: 'Repeat Options',
      repeatEvery: 'Repeat Every',
      frequency: 'Frequency',
      occurringOnThe: 'Occurring On The',
      repeatsOn: 'Repeats On',
      signupsEndDate: 'Sign-up End Date',
      signupsEndTime: 'Sign-up End Time',
      eventType: 'Event Type',
      costsMoney: 'Costs Money',
      limitedSpots: 'Limited Spots',
      hideFromDailyCalendar: 'Hide from daily calendar',
      truncateEventName: 'Truncate event name',
      hideFromWeeklyCalendar: 'Hide from weekly calendar',
      hideEventEndTimes: 'Hide event end times',
      hideFromMonthlyCalendar: 'Hide from monthly calendar',
      options: 'Options',
      eventDescriptions: 'Event Descriptions',
      amAndPm: 'AM and PM',
      eventEndTime: 'Event End Time',
      locationNames: 'Location Names',
      dayOfWeek: 'Day of Week',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      timeRange: 'Time Range',
    },
    scheduling: {
      title: 'Event Scheduling',
      viewVideoInstructions: 'View video scheduling instructions',
      videoInstructions: 'Video scheduling instructions',
      videoLongerThanEvent: `If the video is longer than the event, it will stop playing on the
      TV Channel at the event's end time.`,
      videoShorterThanEvent: `If the video is shorter than the event, it will stop playing on the
      TV Channel when it finishes. The TV will then switch back to the
      slideshows published from the Digital Signage Manager.`,
      viewSupportArticle: 'View Support Article',
    },
    moreInfo: {
      title: 'More Information',
      removeSelectedEventType: 'Remove selected event type',
    },
    widgetOptions: {
      title: 'Calendar Widget Options',
    },
    deletion: {
      willBeRemovedFromDashboard:
        'Deleting this event will remove it from the dashboard.',
      rsvpsWillBeRemoved:
        'Any RSVPs will also be removed. You cannot undo this action.',
      deleteSuccess: (name) => `${name} was successfully deleted`,
      deleteSeries: 'Delete Series',
      deleteEvent: 'Delete Event',
    },
    validation: {
      videoUrl: 'The provided url is not a valid video link',
      eventName: 'Must have an event name',
      calendarsMin: 'Must select at least one calendar',
      status: 'Must select a status',
      validUrl: 'Must enter a valid url, ensure your link starts with `https`',
      url: 'Must submit a video url',
      validStartDate: 'Must have a valid start date',
      validDate: 'Must be a valid date',
      validTime: 'Must be a valid time',
      startDatePriorToEndDate: 'Start date must be prior to the end date',
      startDateNotInThePast: 'Event start date cannot be in the past',
      validStartTime: 'Must have a valid start time',
      startTimeNotInThePast: 'Event start time cannot be in the past',
      endTimeLaterThanStartTime:
        'Event end time must be later than event start time.',
      repeatingInterval: 'Must indicate repeating interval',
      signupsEndDatePriorToStartDate:
        'Sign-up end date and time must be prior to Event start date and time',
      signupsEndDateNotInThePast: "Signups end date can't be in the past",
      mustBe: (inputType) => `Must be ${inputType}`,
      cannotBe: (condition) => `Cannot be ${condition}`,
      frequency: 'Must select a least one frequency option',
      oneWeekday: 'Must select at least one weekday',
      validNumber: 'Must enter a valid number',
      oneSpot: 'Must have at least one spot',
      residentsHaveSignedUp: (num) => `${num} residents have signed up`,
      videoSource: 'Must select a video source',
    },
    videoUrlHelp: {
      learnAbout: 'Learn about supported video links',
      supportedVideoLinks: 'Supported Video Links',
      followingLinksSupported: 'The following video links are supported:',
      youTubeVideos: 'YouTube Videos',
      youTubePlaylists: 'YouTube Playlists',
      youTubeLive: 'YouTube Live',
      vimeo: 'Vimeo',
      followingIntegrationsSupported:
        'The following integrations are supported:',
      spiro100: 'Spiro 100',
      eversound: 'Eversound',
      integrationsRequiredUpgrade: 'These integrations require an upgrade.',
      learnMoreUpgrading: 'Learn more about upgrading ',
      needHelp: 'Need help? Go to the support article on using',
      directBroadcast: 'Direct Broadcast ',
    },
    download: {
      downloadEventListToWord: 'Download Event List to Word',
    },
    edition: {
      editEvent: 'Edit Event',
      thisEvent: 'This event',
      thisAndFollowingEvents: 'This and following events',
    },
    delete: 'Delete',
    archive: 'Archive',
    deletionModal: {
      deleteEvent: 'Delete Event?',
      thisEventWarning:
        'Deleting this event will remove it from the calendar for staff and residents. Attendance tracking will no longer be available. You cannot undo this action.',
      thisAndFollowingEventsWarning:
        'Deleting will remove all events in the series from the calendar for staff and residents. Attendance tracking will no longer be available. You cannot undo this action.',
    },
    archiving: {
      archiveEvent: 'Archive Event?',
      thisEventWarning:
        "Archiving this event will remove it from the resident's event calendar. Attendance history will still be available.",
      thisAndFollowingEventsWarning:
        "Archiving will remove all events in the series from the resident's event calendar. Attendance history will still be available.",
      archiveSuccess: (name) => `${name} was successfully archived.`,
    },
  },
  preview: {
    loadingPreview: 'Loading Preview',
    previewNotExist: "Preview doesn't exist",
  },
};
