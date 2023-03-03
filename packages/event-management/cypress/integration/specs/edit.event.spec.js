/** @format */
/// <reference types="Cypress" />
import Create from '../tasks/CreateEvent';
import { Auth } from '../utils';
import {
  eventNames,
  EditEventDetails,
  TOMORROW,
  EditEventName,
  NINE_THIRTY_AM,
  EIGHT_THIRTY_AM,
} from '../utils/Consts';
import { UrlOptions } from '../utils/SetupBrowser';
import EventManagerPage from '../components/page-handler/event-model';

context(
  'we should be able to add a calendar and event type and location',
  () => {
    before(() => {
      Auth.user();
      UrlOptions.onLoad(window);
    });

    beforeEach(() => {
      Cypress.Cookies.preserveOnce('jwt', 'session');
      cy.visit(UrlOptions);
      cy.reload();
    });

    it(`Create a virtual event and change to non-virtual`, () => {
      Create.anEvent()
        .named(eventNames.SINGLE_VIRTUAL_NAME)
        .locatedInLocation('Auto')
        .belongingToCalendar('AU')
        .withDescription('This event is a test event!')
        .thatIsVirtual()
        .withEventUrl('https://www.youtube.com/watch?v=VrDc0W-Epc8')
        .withStartDate(TOMORROW)
        .withStartTime(EIGHT_THIRTY_AM)
        .withEndTime(NINE_THIRTY_AM);
      EventManagerPage.publishEvent(eventNames.SINGLE_VIRTUAL_NAME);
      EventManagerPage.applyStatusFilterAndVaidate(
        'published',
        eventNames.SINGLE_VIRTUAL_NAME,
      );
      EventManagerPage.openSingleEvent(eventNames.SINGLE_VIRTUAL_NAME);
      EventManagerPage.editEvent(EditEventDetails);
      EventManagerPage.publishEvent(eventNames.SINGLE_VIRTUAL_NAME, true);
      EventManagerPage.applyStatusFilterAndVaidate(
        'published',
        eventNames.SINGLE_VIRTUAL_NAME,
      );
      EventManagerPage.deleteSingleEvent(eventNames.SINGLE_VIRTUAL_NAME);
    });

    it('Editing the Published event', () => {
      Create.anEvent()
        .named(eventNames.REOCCURING_EVENT_NAME)
        .belongingToCalendar('AU')
        .withStartDate(TOMORROW)
        .thatRepeats()
        .daily();
      EventManagerPage.publishEvent(eventNames.REOCCURING_EVENT_NAME);
      EventManagerPage.applyStatusFilterAndVaidate(
        'published',
        eventNames.REOCCURING_EVENT_NAME,
      );
      EventManagerPage.openReoccurringEvent(eventNames.REOCCURING_EVENT_NAME);
      EventManagerPage.editEvent(EditEventName);
      EventManagerPage.publishEvent(EditEventName.EventName, true);
      EventManagerPage.applyStatusFilterAndVaidate(
        'published',
        EditEventName.EventName,
      );
      EventManagerPage.deleteAllEvents(EditEventName.EventName);
    });
  },
);
