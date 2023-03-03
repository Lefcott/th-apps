/**
 * Event Form component namespace...this ones a doozy
 *
 * @format
 * @namespace EventForm
 */

export default {
  /**
   * basicInfo selectors for event form
   * @prop {string} name selector for name input in event form
   * @prop {string} description selector for event description input in event form
   * @prop {string} url selector for event url input in event form
   * @prop {string} calendars selector for calendars dropdown in event form
   * @prop {object} location
   * @prop {function(locationName:string)} location.named selector for location dropdown option containing `locationName` in event form
   * @prop {string} location.dropdown selector for location dropdown in event form
   * @prop {object} status
   * @prop {string} status.dropdown selector for status dropdown in event form
   * @prop {string} status.Published selector for Published status option in event form
   * @prop {string} status.Draft selector for Draft status option in event form
   * @prop {string} status.Archived selector for Archived status option in event form
   *
   */
  basicInfo: {
    name: `[name="name"]`,
    description: `textarea[name="description"]`,
    linkPreview: `[role="link-preview"]`,
    calendars: `[name="calendars"]`,
    location: {
      dropdown: `#mui-component-select-location`,
      named: (locationName) =>
        `li.MuiMenuItem-root:contains("${locationName}")`,
    },
    status: {
      dropdown: `#mui-component-select-status`,
      Published: `[data-value="Published"]`,
      Draft: `[data-value="Draft"]`,
      Archived: `[data-value="Archived"]`,
    },
  },

  /**
   * virtualEvent selectors for event form
   * @prop {string} name selector for name input in event form
   * @prop {string} description selector for event description input in event form
   * @prop {string} url selector for event url input in event form
   * @prop {string} calendars selector for calendars dropdown in event form
   * @prop {object} location
   * @prop {function(locationName:string)} location.named selector for location dropdown option containing `locationName` in event form
   * @prop {string} location.dropdown selector for location dropdown in event form
   * @prop {object} status
   * @prop {string} status.dropdown selector for status dropdown in event form
   * @prop {string} status.Published selector for Published status option in event form
   * @prop {string} status.Draft selector for Draft status option in event form
   * @prop {string} status.Archived selector for Archived status option in event form
   *
   */
  virtualEvent: {
    virtualEventToggle: `#EM_virtualEvents-toggles-virtualEvent`,
    showOnTvToggle: `#EM_virtualEvents-toggles-showOnTv`,
    url: `[name="url"]`,
    channel: {
      dropdown: `[name="virtualEventDestinations"]`,
      named: (channelName) => `li.MuiMenuItem-root:contains("${channelName}")`,
    },
    source: {
      dropdown: `[name="videoSource"]`,
      dvd: `li.MuiMenuItem-root:contains("dvd")`,
      youtubeVideo: `li.MuiMenuItem-root:contains("youtubeVideo")`,
      youtubeLive: `li.MuiMenuItem-root:contains("youtubeLive")`,
      youtubePlaylist: `li.MuiMenuItem-root:contains("youtubePlaylist")`,
      vimeoVideo: `li.MuiMenuItem-root:contains("vimeoVideo")`,
    },
  },

  /**
   * Schedule selectors for event form
   * @prop {string} allDay selector for component in event form
   *
   * @prop {object} startDate
   * @prop {string} startDate.input selector for component in event form
   * @prop {string} startDate.icon selector for component in event form
   *
   * @prop {object} endDate
   * @prop {string} endDate.input selector for component in event form
   * @prop {string} endDate.icon selector for component in event form
   *
   * @prop {object} startTime
   * @prop {string} startTime.input selector for component in event form
   * @prop {string} startTime.icon selector for component in event form
   *
   * @prop {object} endTime
   * @prop {string} endTime.input selector for component in event form
   * @prop {string} endTime.icon selector for component in event form
   *
   * @prop {object} repeat
   * @prop {string} repeat.dropdown selector for component in event form
   * @prop {string} repeat.doesNotRepeat selector for component in event form
   * @prop {string} repeat.daily selector for component in event form
   * @prop {string} repeat.weekly selector for component in event form
   * @prop {string} repeat.monthly selector for component in event form
   * @prop {object} repeat.custom see <a href="/#eventformschedulerepeatcustom" >custom</a>
   *
   */

  schedule: {
    allDay: `[label="All Day"] > span > input`,
    startDate: {
      input: `#Em_event_startDateInput`,
      icon: `#Em_event_startDateIcon`,
    },
    endDate: {
      input: `#Em_event_endDateInput`,
      icon: `#Em_event_endDateIcon`,
    },
    startTime: {
      input: `#Em_event_startTimeInput`,
      icon: `#Em_event_startTimeBtn`,
    },
    endTime: {
      input: `#Em_event_endTimeInput`,
      icon: `#Em_event_endTimeBtn`,
    },
    repeat: {
      dropdown: `#mui-component-select-repeat`,
      doesNotRepeat: `[data-value="doesNotRepeat"]`,
      daily: `[data-value="repeatDaily"]`,
      weekly: `[data-value="repeatWeekly"]`,
      monthly: `[data-value="repeatMonthly"]`,
      /**
       * The custom repeating options
       * @namespace
       * @name EventForm.schedule.repeat.custom
       * @prop {string} option selector for component in event form
       * @prop {string} interval selector for `Repeat Every: *` input
       *
       * @prop {object} freq
       * @prop {string} freq.dropdown selector for `Frequency *` dropdown
       * @prop {string} freq.days frequency dropdown option for days
       * @prop {string} freq.weeks frequency dropdown option for weeks
       * @prop {string} freq.months frequency dropdown option for months
       *
       * @prop {object} nthDayOfWeek
       * @prop {string} nthDayOfWeek.dropdown selector for `Occuring On The` dropdown
       * @prop {method} nthDayOfWeek.listItem nthDayOfWeek dropdown list item
       *
       * @prop {object} daysOfWeek
       * @prop {string} daysOfWeek.dropdown selector for `Repeats On *` dropdown
       * @prop {method} daysOfWeek.checkbox daysOfWeek dropdown list item
       * */
      custom: {
        option: `[data-value="custom"]`,
        interval: `[name="repeatInterval"]`,
        freq: {
          dropdown: `#mui-component-select-repeatFrequency`,
          days: `[data-value="3"]`,
          weeks: `[data-value="2"]`,
          months: `[data-value="1"]`,
        },
        nthDayOfWeek: {
          dropdown: `#mui-component-select-occuringOn`,
          listItem: (n) =>
            `li[data-value="${n}"] > label > span.MuiCheckbox-root`,
        },
        daysOfWeek: {
          dropdown: `#mui-component-select-byweekday`,
          checkbox: (dow) =>
            `li[data-value="${dow}"] > label > span.MuiCheckbox-root`,
        },
      },
    },
  },

  /**
   * More Info section selectors for event form
   * @prop {string} costsMoney selector for the costs money checkbox in the event more info section
   * @prop {object} eventType
   * @prop {string} eventType.dropdown selector for the event type dropdown in the event more info section
   * @prop {method} eventType.type selector for the options in the event type dropdown
   * @prop {object} limitedSpots
   * @prop {string} limitedSpots.checkbox selector for the limited spots checkbox in the event more info section
   * @prop {string} limitedSpots.input selector for the input for the limited spots number input in the event more info section
   */

  moreInfo: {
    costsMoney: `[name="costsMoney"]`,
    eventType: {
      dropdown: `#mui-component-select-eventType`,
      type: (type) => `li.MuiMenuItem-root:contains("${type}")`,
    },
    limitedSpots: {
      checkbox: `[label="Limited Spots"] > span > input`,
      input: `[name="numSpots"]`,
    },
  },

  /**
   * Widget Option section selectors for event form
   * @prop {string} hideFromDailyCal selector for checkbox in widget options for hiding event from daily cal
   * @prop {string} hideFromWeeklyCal selector for checkbox in widget options for hiding event from weekly cal
   * @prop {string} hideFromMonthlyCal selector for checkbox in widget options for hiding event from monthly cal
   * @prop {string} truncateEventName selector for checkbox in widget options for truncating event names on the printed calendar
   * @prop {string} showEventEndTimes selector for checkbox in widget options for hiding event times on the printed calendar
   */

  widgetOptions: {
    hideFromDailyCal: `[name="hiddenOn1"]`,
    hideFromWeeklyCal: `[name="hiddenOn7"]`,
    hideFromMonthlyCal: `[name="hiddenOn30"]`,
    truncateEventName: `[name="noWrap"]`,
    showEventEndTimes: `[name="hideEndTime"]`,
  },
};
