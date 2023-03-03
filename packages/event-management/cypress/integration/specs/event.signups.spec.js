/** @format */
/// <reference types="Cypress" />

import { Auth } from '../utils';
import AttendanceSignupsComponents from '../components/page-handler/attendance-signups';
import EventManagerPage from '../components/page-handler/event-model';
import FilterDrawer from '../components/page-handler/filter-drawer';
import Create from '../tasks/CreateEvent';
import { eventNames } from '../utils/Consts';
import { UrlOptions } from '../utils/SetupBrowser';
import { GuestInfo } from '../utils/Consts';

context('EVENT | SIGNUPS,WAITLIST,ATTENDANCE', () => {
  const firstUsersName = 'Newman';
  const secondUsersName = 'Jerry';

  before(() => {
    Auth.user();
    UrlOptions.onLoad(window);
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('jwt', 'session');
    cy.visit(UrlOptions);
    cy.reload();
  });

  it(`Create an event, navigate to signups,Adding just a Resident to signup, confirm additional user cant be added, add them to waitlist`, () => {
    Create.anEvent()
      .named(eventNames.SINGLE_EVENT_NAME)
      .belongingToCalendar('AU')
      .thatCostsMoney()
      .thatIsLimitedToNResidents(1);
    EventManagerPage.publishEvent(eventNames.SINGLE_EVENT_NAME);
    FilterDrawer.calendar.toTestCal();
    EventManagerPage.applyStatusFilterAndVaidate(
      'published',
      eventNames.SINGLE_EVENT_NAME,
    );
    EventManagerPage.openSingleEvent(eventNames.SINGLE_EVENT_NAME);
    AttendanceSignupsComponents.openEventAttendanceTracking();
    AttendanceSignupsComponents.addUserNamed(firstUsersName).toSignups();
    AttendanceSignupsComponents.moveUserNamed(
      firstUsersName,
    ).fromSignupsToWaitlist();
    AttendanceSignupsComponents.moveUserNamed(
      firstUsersName,
    ).fromWaitlistToSignups();
    AttendanceSignupsComponents.addUserNamed(secondUsersName).toWaitlist();
    AttendanceSignupsComponents.removeUserNamed(firstUsersName).fromSignups();
    AttendanceSignupsComponents.removeUserNamed(secondUsersName).fromWaitlist();
    EventManagerPage.deleteSingleEvent(eventNames.SINGLE_EVENT_NAME);
  });

  it(`Create an event, navigate to signups, add a Resident and guest to signup`, () => {
    Create.anEvent()
      .named(eventNames.SINGLE_EVENT_NAME)
      .belongingToCalendar('AU')
      .thatCostsMoney()
      .thatIsLimitedToNResidents(2);
    EventManagerPage.publishEvent(eventNames.SINGLE_EVENT_NAME);
    FilterDrawer.calendar.toTestCal();
    EventManagerPage.applyStatusFilterAndVaidate(
      'published',
      eventNames.SINGLE_EVENT_NAME,
    );
    EventManagerPage.openSingleEvent(eventNames.SINGLE_EVENT_NAME);
    AttendanceSignupsComponents.openEventAttendanceTracking();
    AttendanceSignupsComponents.addGuestName(firstUsersName).toSignups();
    AttendanceSignupsComponents.moveUserNamed(
      GuestInfo.GUEST_NAME,
    ).fromSignupsToWaitlist();
    AttendanceSignupsComponents.moveUserNamed(
      firstUsersName,
    ).fromSignupsToWaitlist();
    AttendanceSignupsComponents.removeUserNamed(
      GuestInfo.GUEST_NAME,
    ).fromWaitlist();
    EventManagerPage.deleteSingleEvent(eventNames.SINGLE_EVENT_NAME);
  });
});
