/**
 * Event Modal component namespace, this is the popup that shows when you
 * select an event in the week calendar that is part of a series that asks
 * (do you want to edit just this event or all the events in the series)
 *
 * @format
 * @prop {string} modal the selector for the modal body
 * @prop {string} okBtn the selector for the ok(confirmation) button on the modal
 * @prop {string} cancelBtn the selector for the ok(confirmation) button on the modal
 * @prop {string} singleEventOption the selector for the radio button for only editing the single event
 * @prop {string} recurringEventOption the selector for the radio button for editing all the events in the series
 */
export const EventCalendarElements = {
  createdEvent: '#Em_calendarEvent-%s',
  calendarSunday: "div[class='MuiGrid-root css-1fjc1zy MuiGrid-item']",
};

export const EventManagerElements = {
  eventSearchbar: '#Em_eventSearchbar',
  previewCalendar: '#Em_calendar-preview',
  currentMonth: '//*[text()="%s"]',
  previewLink : '//div[@id="Em_calendar-preview"]//child::a',
  previewlinkButton : '//div[@id="Em_calendar-preview"]'
};

export const EventManagerButtons = {
  previewBtn: '#Em_calendar-preview',
  drawerCloseBtn: '#Em_drawer-close',
  newEventBtn: '#Em_calendar-newEvent',
  deleteEventBtn: '.MuiButtonBase-root:contains("Delete Event")',
  deleteSeriesBtn: '.MuiButtonBase-root:contains("Delete Series")',
  deleteEventConfirmBtn: '.MuiButton-contained:contains("Delete")',
  eventSaveBtn: '#Em_event-save',
  deleteEventKebab: "svg[class='MuiSvgIcon-root css-1baz1f0']",
  deleteBtn: '.MuiTypography-caption:contains("Delete")',
  confirmOkBtn: '#Em_eventEditModal-ok',
  backToEvents: '#EM_eventDrawer-close',
  thisEventOption: '',
  allEventOption: '#Em_eventEditModal-recurringEvent',
};

export const EditEventElements = {
  publishBtn: '#Em_event-save',
  statusDropDown: '#Em_event-actions-dropdown',
  saveAsDraftAction: '#Em_event-action-saveDraft',
  deleteAction: '#Em_event-action-delete',
  archiveAction: '#Em_event-action-archive',
  virtualEventToggle: `#EM_virtualEvents-toggles-virtualEvent`,
  eventNameInput: `[name="name"]`,
};

export const EventToastMessages = {
  dismiss: '.teamhub-toast-MuiButton-label',
  eventCreatedSuccess:
    '#notistack-snackbar:contains("%s was successfully created")',
  eventEditedSuccess:
    '#notistack-snackbar:contains("%s was successfully edited")',
  arichivedToast: '#notistack-snackbar:contains("was successfully archived.")',
  deletedToast: '#notistack-snackbar:contains("was successfully deleted")',
};

export const EventStatusElements = {
  allStatus: '#Em-status-filter-all',
  status: '#Em-status-filter-%s',
};

export default {
  modal: `#Em_eventEditModal`,
  okBtn: `#Em_eventEditModal-ok`,
  cancelBtn: `#Em_eventEditModal-cancel`,
  singleEventOption: `#Em_eventEditModal-singleEvent`,
  recurringEventOption: `#Em_eventEditModal-recurringEvent`,
};
