/**
 * Event Side Navigation component namespace
 *
 * @format
 * @namespace
 * @prop {string} EventSideNavAttendanceTracking the event sidenav option that returns the Attendance Tracking list item selector from the sidenav
 * @prop {string} EventSideNavSignupsWaitList the event sidenav option that returns the Sign Up & Waitlist list item selector from the sidenav
 * @prop {string} EventsSideNavEventAttendance the event sidenav option that returns the Event Attendance list item selector from the sidenav
 * @prop {string} EventsSideNavEventInfo the event sidenav option that returns the Event Info list item selector from the sidenav
 */

export default {
  EventSideNavAttendanceTracking:
    '.MuiListItemText-primary:contains("Attendance Tracking")',
  EventSideNavSignupsWaitList:
    '.MuiListItemText-primary:contains("Sign Up & Waitlist")',
  EventsSideNavEventAttendance:
    '.MuiListItemText-primary:contains("Event Attendance")',
  EventsSideNavEventInfo: '.MuiListItemText-primary:contains("Event Info")',
};
