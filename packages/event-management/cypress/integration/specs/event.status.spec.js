/** @format */

import Create from '../tasks/CreateEvent';
import { Auth } from '../utils';
import { UrlOptions } from '../utils/SetupBrowser';
import { A_WEEK_FROM_NOW, TODAY, eventNames } from '../utils/Consts';
import EventManagerPage from '../components/page-handler/event-model';

context('EVENT | STATUS: DRAFT,PUBLISHED,ARCHIVED', () => {
  before(() => {
    Auth.user();
    UrlOptions.onLoad(window);
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('jwt', 'session');
    cy.visit(UrlOptions);
    cy.reload();
  });

  it('Create a single Event - PUBLISH and SAVE AS DRAFT ', () => {
    Create.anEvent()
      .named(eventNames.SINGLE_EVENT_NAME)
      .locatedInLocation('Au')
      .belongingToCalendar('AU')
      .withDescription('Single Draft Event!')
      .withStartDate(TODAY);
    EventManagerPage.publishEvent(eventNames.SINGLE_EVENT_NAME);
    EventManagerPage.applyStatusFilterAndVaidate(
      'published',
      eventNames.SINGLE_EVENT_NAME,
    );
    EventManagerPage.openSingleEvent(eventNames.SINGLE_EVENT_NAME);
    EventManagerPage.saveAsDraftEvent(eventNames.SINGLE_EVENT_NAME, true);
    EventManagerPage.applyStatusFilterAndVaidate(
      'draft',
      eventNames.SINGLE_EVENT_NAME,
    );
    EventManagerPage.deleteSingleEvent(eventNames.SINGLE_EVENT_NAME);
  });

  it('Create reoccurring Event - PUBLISH and SAVE TO DRAFTS', () => {
    Create.anEvent()
      .named(eventNames.REOCCURING_EVENT_NAME)
      .locatedInLocation('Au')
      .belongingToCalendar('AU')
      .withDescription('Reoccurring Draft Event!')
      .withStartDate(TODAY)
      .thatRepeats()
      .daily()
      .withEndDate(A_WEEK_FROM_NOW);
    EventManagerPage.publishEvent(eventNames.REOCCURING_EVENT_NAME);
    EventManagerPage.applyStatusFilterAndVaidate(
      'published',
      eventNames.REOCCURING_EVENT_NAME,
    );
    EventManagerPage.openReoccurringEvent(eventNames.REOCCURING_EVENT_NAME);
    EventManagerPage.saveAsDraftEvent(eventNames.REOCCURING_EVENT_NAME, true);
    EventManagerPage.applyStatusFilterAndVaidate(
      'draft',
      eventNames.REOCCURING_EVENT_NAME,
    );
    EventManagerPage.deleteAllEvents(eventNames.REOCCURING_EVENT_NAME);
  });

  it('Create a single Event - PUBLISH and MOVE TO ARCHIVED ', () => {
    Create.anEvent()
      .named(eventNames.SINGLE_ARCHIVED_EVENT_NAME)
      .locatedInLocation('Au')
      .belongingToCalendar('AU')
      .withDescription('Single Archived Event!')
      .withStartDate(TODAY);
    EventManagerPage.publishEvent(eventNames.SINGLE_ARCHIVED_EVENT_NAME);
    EventManagerPage.applyStatusFilterAndVaidate(
      'published',
      eventNames.SINGLE_ARCHIVED_EVENT_NAME,
    );
    EventManagerPage.openSingleEvent(eventNames.SINGLE_ARCHIVED_EVENT_NAME);
    EventManagerPage.moveToArchived(
      eventNames.SINGLE_ARCHIVED_EVENT_NAME,
      true,
    );
    EventManagerPage.applyStatusFilterAndVaidate(
      'archived',
      eventNames.SINGLE_ARCHIVED_EVENT_NAME,
    );
    EventManagerPage.deleteSingleEvent(eventNames.SINGLE_ARCHIVED_EVENT_NAME);
  });

  it('Create reoccurring Event- PUBLISH and MOVE TO ARCHIVED ', () => {
    Create.anEvent()
      .named(eventNames.REOCCURING_ARCHIVED_EVENT_NAME)
      .locatedInLocation('Au')
      .belongingToCalendar('AU')
      .withDescription('Reoccurring Draft Event!')
      .withStartDate(TODAY)
      .thatRepeats()
      .daily()
      .withEndDate(A_WEEK_FROM_NOW);
    EventManagerPage.publishEvent(eventNames.REOCCURING_ARCHIVED_EVENT_NAME);
    EventManagerPage.applyStatusFilterAndVaidate(
      'published',
      eventNames.REOCCURING_ARCHIVED_EVENT_NAME,
    );
    EventManagerPage.openReoccurringEvent(
      eventNames.REOCCURING_ARCHIVED_EVENT_NAME,
    );
    EventManagerPage.moveToArchived(
      eventNames.REOCCURING_ARCHIVED_EVENT_NAME,
      true,
    );
    EventManagerPage.applyStatusFilterAndVaidate(
      'archived',
      eventNames.REOCCURING_ARCHIVED_EVENT_NAME,
    );
    EventManagerPage.deleteAllEvents(eventNames.REOCCURING_ARCHIVED_EVENT_NAME);
  });

  it('Create Single Virtual Event- PUBLISH and MOVE TO DRAFT', () => {
    Create.anEvent()
      .named(eventNames.SINGLE_VIRTUAL_NAME)
      .locatedInLocation('Au')
      .belongingToCalendar('AU')
      .withDescription('Virtual Draft Event!')
      .withStartDate(TODAY)
      .thatIsVirtual()
      .withEventUrl('https://www.youtube.com/watch?v=Yiaatr-Noh0');
    EventManagerPage.publishEvent(eventNames.SINGLE_VIRTUAL_NAME);
    EventManagerPage.applyStatusFilterAndVaidate(
      'published',
      eventNames.SINGLE_VIRTUAL_NAME,
    );
    EventManagerPage.openSingleEvent(eventNames.SINGLE_VIRTUAL_NAME);
    EventManagerPage.saveAsDraftEvent(eventNames.SINGLE_VIRTUAL_NAME, true);
    EventManagerPage.applyStatusFilterAndVaidate(
      'draft',
      eventNames.SINGLE_VIRTUAL_NAME,
    );
    EventManagerPage.deleteSingleEvent(eventNames.SINGLE_VIRTUAL_NAME);
  });

  it('Create reoccurring virtual Event- PUBLISH MOVE TO ARCHIVED', () => {
    Create.anEvent()
      .named(eventNames.REOCCURING_VIRTUAL_NAME)
      .locatedInLocation('Au')
      .belongingToCalendar('AU')
      .withDescription('Virtual Archived Event!')
      .thatIsVirtual()
      .withEventUrl('https://www.youtube.com/watch?v=Yiaatr-Noh0')
      .withStartDate(TODAY)
      .thatRepeats()
      .daily()
      .withEndDate(A_WEEK_FROM_NOW);
    EventManagerPage.publishEvent(eventNames.REOCCURING_VIRTUAL_NAME);
    EventManagerPage.applyStatusFilterAndVaidate(
      'published',
      eventNames.REOCCURING_VIRTUAL_NAME,
    );
    EventManagerPage.openReoccurringEvent(eventNames.REOCCURING_VIRTUAL_NAME);
    EventManagerPage.moveToArchived(eventNames.REOCCURING_VIRTUAL_NAME, true);
    EventManagerPage.applyStatusFilterAndVaidate(
      'archived',
      eventNames.REOCCURING_VIRTUAL_NAME,
    );
    EventManagerPage.deleteAllEvents(eventNames.REOCCURING_VIRTUAL_NAME);
  });
});
