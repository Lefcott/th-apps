/** @format */

/// <reference types="Cypress" />
import Create from '../tasks/CreateEvent';
import { Auth } from '../utils';
import EventManagerPage from '../components/page-handler/event-model';
import {
  CARDINAL_NUMS,
  ORDINAL_NUMS,
  WEEKDAYS,
  eventNamer,
  TODAY,
  A_WEEK_FROM_NOW,
} from '../utils/Consts';
import { UrlOptions } from '../utils/SetupBrowser';
const { SU, MO, TU, WE, TH, FR, SA } = WEEKDAYS;
const { ONE } = CARDINAL_NUMS;
const { FIRST, SECOND, THIRD, FOURTH, FIFTH } = ORDINAL_NUMS;

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

    it('Monthly repeating event with default start date, start time, and end time C813', () => {
      const EVENT_NAME = eventNamer();
      Create.anEvent()
        .named(EVENT_NAME)
        .belongingToCalendar('AU')
        .withStartDate(A_WEEK_FROM_NOW)
        .thatRepeats()
        .monthly()
        .save();
      EventManagerPage.deleteAllEvents(EVENT_NAME);
    });

    it('Custom, Monthly: Repeat 1st Monday of the month C246', () => {
      const EVENT_NAME = eventNamer();
      Create.anEvent()
        .named(EVENT_NAME)
        .belongingToCalendar('AU')
        .withStartDate(TODAY)
        .thatRepeats()
        .withACustomSchedule()
        .every(ONE)
        .months()
        .every([FIRST])
        .onDays([MO])
        .save()
        .validate();
      EventManagerPage.deleteAllEvents(EVENT_NAME);
    });

    it('Custom, Monthly: Repeat 1st Monday & Wednesday of the month C247', () => {
      const EVENT_NAME = eventNamer();
      Create.anEvent()
        .named(EVENT_NAME)
        .belongingToCalendar('AU')
        .withStartDate(TODAY)
        .thatRepeats()
        .withACustomSchedule()
        .every(ONE)
        .months()
        .every([FIRST])
        .onDays([MO, WE])
        .save()
        .validate();
      EventManagerPage.deleteAllEvents(EVENT_NAME);
    });

    it('Custom, Monthly: Repeat 2nd Tuesday of the month C248', () => {
      const EVENT_NAME = eventNamer();
      Create.anEvent()
        .named(EVENT_NAME)
        .belongingToCalendar('AU')
        .withStartDate(TODAY)
        .thatRepeats()
        .withACustomSchedule()
        .every(ONE)
        .months()
        .every([SECOND])
        .onDays([TU])
        .save()
        .validate();
      EventManagerPage.deleteAllEvents(EVENT_NAME);
    });

    it('Custom, Monthly: Repeat 2nd Friday, Saturday, & Sunday of the month C249', () => {
      const EVENT_NAME = eventNamer();
      Create.anEvent()
        .named(EVENT_NAME)
        .belongingToCalendar('AU')
        .withStartDate(TODAY)
        .thatRepeats()
        .withACustomSchedule()
        .every(ONE)
        .months()
        .every([SECOND])
        .onDays([FR, SA, SU])
        .save()
        .validate();
      EventManagerPage.deleteAllEvents(EVENT_NAME);
    });

    it.only('Custom, Monthly: Repeat 3rd Thursday of the month C250', () => {
      const EVENT_NAME = eventNamer();
      Create.anEvent()
        .named(EVENT_NAME)
        .belongingToCalendar('AU')
        .withStartDate(TODAY)
        .thatRepeats()
        .withACustomSchedule()
        .every(ONE)
        .months()
        .every([THIRD])
        .onDays([TH])
        .save()
        .validate();
      EventManagerPage.deleteAllEvents(EVENT_NAME);
    });

    it('Custom, Monthly: Repeat 3rd Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, & Sunday of the month C251', () => {
      const EVENT_NAME = eventNamer();
      Create.anEvent()
        .named(EVENT_NAME)
        .belongingToCalendar('AU')
        .withStartDate(TODAY)
        .thatRepeats()
        .withACustomSchedule()
        .every(ONE)
        .months()
        .every([THIRD])
        .onDays([MO, TU, WE, TH, FR, SA, SU])
        .save()
        .validate();
    });

    it('Custom, Monthly: Repeat 3rd and 4th Monday of the month C252', () => {
      const EVENT_NAME = eventNamer();
      Create.anEvent()
        .named(EVENT_NAME)
        .belongingToCalendar('AU')
        .withStartDate(TODAY)
        .thatRepeats()
        .withACustomSchedule()
        .every(ONE)
        .months()
        .every([THIRD, FOURTH])
        .onDays([MO])
        .save()
        .validate();
      EventManagerPage.deleteAllEvents(EVENT_NAME);
    });

    it('Custom, Monthly: Repeat 4th and 5th Monday and Wednesday of the month C253', () => {
      const EVENT_NAME = eventNamer();
      Create.anEvent()
        .named(EVENT_NAME)
        .belongingToCalendar('AU')
        .withStartDate(TODAY)
        .thatRepeats()
        .withACustomSchedule()
        .every(ONE)
        .months()
        .every([FOURTH, FIFTH])
        .onDays([MO, WE])
        .save()
        .validate();
      EventManagerPage.deleteAllEvents(EVENT_NAME);
    });

    it('Custom, Monthly: Repeat 5th Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, & Sunday of the month C257', () => {
      const EVENT_NAME = eventNamer();
      Create.anEvent()
        .named(EVENT_NAME)
        .belongingToCalendar('AU')
        .withStartDate(TODAY)
        .thatRepeats()
        .withACustomSchedule()
        .every(ONE)
        .months()
        .every([FIFTH])
        .onDays([MO, TU, WE, TH, FR, SA, SU])
        .save()
        .validate();
      EventManagerPage.deleteAllEvents(EVENT_NAME);
    });
  },
);
