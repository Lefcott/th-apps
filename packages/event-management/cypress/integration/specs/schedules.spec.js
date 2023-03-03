/** @format */
/// <reference types="Cypress" />
import Create from '../tasks/CreateEvent';
import { Auth } from '../utils';
import {
  CARDINAL_NUMS,
  ORDINAL_NUMS,
  WEEKDAYS,
  eventNamer,
  EIGHT_THIRTY_AM,
  NINE_THIRTY_AM,
  ELEVEN_FORTY_FIVE_PM,
  TODAY,
  TOMORROW,
  A_WEEK_FROM_NOW,
  TWO_MONTHS_FROM_NOW,
  eventNames,
} from '../utils/Consts';
import { UrlOptions } from '../utils/SetupBrowser';
import EventManagerPage from '../components/page-handler/event-model';
const { SU, MO, WE, FR } = WEEKDAYS;
const { ONE, TWO, THREE } = CARDINAL_NUMS;
const { FIRST, FOURTH } = ORDINAL_NUMS;

const { TEST_LEVEL: testLevel } = Cypress.env();

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

    it(`Create an event with every option availible`, () => {
      const EVENT_NAME = eventNamer();
      Create.anEvent()
        .named(EVENT_NAME)
        .locatedInLocation('Auto')
        .belongingToCalendar('AU')
        .withDescription('This event is a test event!')
        .thatIsVirtual()
        .withEventUrl('https://www.youtube.com/watch?v=VrDc0W-Epc8')
        .withStartTime(EIGHT_THIRTY_AM)
        .withEndTime(ELEVEN_FORTY_FIVE_PM)
        .withStartDate(TOMORROW)
        .thatHasType('Major')
        .thatCostsMoney()
        .thatIsLimitedToNResidents(5)
        .thatIsHiddenFromDailyCalendar()
        .thatIsHiddenFromWeeklyCalendar()
        .thatIsHiddenFromMonthlyCalendar()
        .thatHasEventNameTruncatedOnCalendar()
        .thatHasEndTimeShownOnCalendar()
        .thatRepeats()
        .withACustomSchedule()
        .every(ONE)
        .months()
        .every([FIRST, FOURTH])
        .onDays([MO, SU])
        .withEndDate(TWO_MONTHS_FROM_NOW)
        .save()
        .validate();
      EventManagerPage.deleteAllEvents(EVENT_NAME);
    });

    it('Custom Weekly: repeat every 3 weeks on Monday, Wednesday, and Friday', () => {
      const EVENT_NAME = eventNamer();
      Create.anEvent()
        .named(EVENT_NAME)
        .belongingToCalendar('AU')
        .withStartDate(TOMORROW)
        .withStartTime(NINE_THIRTY_AM)
        .withEndTime(ELEVEN_FORTY_FIVE_PM)
        .thatRepeats()
        .withACustomSchedule()
        .every(THREE)
        .weeks()
        .onDays([MO, WE, FR])
        .save()
        .validate();
      EventManagerPage.deleteAllEvents(EVENT_NAME);
    });

    it('New event that repeats every 2 days', () => {
      const EVENT_NAME = eventNamer();
      Create.anEvent()
        .named(EVENT_NAME)
        .belongingToCalendar('AU')
        .withStartDate(A_WEEK_FROM_NOW)
        .withStartTime(EIGHT_THIRTY_AM)
        .withEndTime(ELEVEN_FORTY_FIVE_PM)
        .thatRepeats()
        .withACustomSchedule()
        .every(TWO)
        .days()
        .save()
        .validate();
      EventManagerPage.deleteAllEvents(EVENT_NAME);
    });

    // Virtual, non repeating, youtube source
    if (testLevel !== 'smoke') {
      it('Daily repeating event with default start date, start time, and end time', () => {
        const EVENT_NAME = eventNamer();
        Create.anEvent()
          .named(EVENT_NAME)
          .belongingToCalendar('AU')
          .withStartDate(A_WEEK_FROM_NOW)
          .thatRepeats()
          .daily()
          .save()
          .validate();
        EventManagerPage.deleteAllEvents(EVENT_NAME);
      });

      it('Weekly repeating event with default start date, start time, and end time', () => {
        const EVENT_NAME = eventNamer();
        Create.anEvent()
          .named(EVENT_NAME)
          .belongingToCalendar('AU')
          .withStartDate(A_WEEK_FROM_NOW)
          .thatRepeats()
          .weekly()
          .save()
          .validate();
        EventManagerPage.deleteAllEvents(EVENT_NAME);
      });

      it('Event with start date: today; times: all day', () => {
        const EVENT_NAME = eventNamer();
        Create.anEvent()
          .named(EVENT_NAME)
          .belongingToCalendar('AU')
          .withStartDate(TODAY)
          .isAllDay()
          .save()
          .validate();
        EventManagerPage.deleteSingleEvent(EVENT_NAME);
      });

      it('Non-repeating event with default start date, start time, and end time', () => {
        Create.anEvent()
          .named(eventNames.SINGLE_VIRTUAL_NAME)
          .withStartDate(TODAY)
          .belongingToCalendar('AU')
          .thatIsVirtual()
          .thatIsShownOnTvChannel('TEST_VIDEO')
          .fromVideoSource('link')
          .withEventUrl('https://www.youtube.com/watch?v=VrDc0W-Epc8')
          .save()
          .validate();
      });

      it('Daily repeating event with default start date, start time, end time, and with end date tomorrow', () => {
        Create.anEvent()
          .named(eventNames.REOCCURING_EVENT_NAME)
          .belongingToCalendar('AU')
          .withStartDate(TODAY)
          .thatRepeats()
          .daily()
          .save()
          .validate();
        EventManagerPage.applyStatusFilterAndVaidate(
          'published',
          eventNames.REOCCURING_EVENT_NAME,
        );
        EventManagerPage.deleteAllEvents(eventNames.REOCCURING_EVENT_NAME);
      });
    }
  },
);
