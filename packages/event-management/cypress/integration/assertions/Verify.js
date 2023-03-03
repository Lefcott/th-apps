/** @format */

import { TestCleanup } from '../utils';
import moment from 'moment-timezone';
import MonthCalComponent from '../components/page-handler/month-cal';
import weekCalElements from '../components/page-elements/week-cal/elements';
import Toast from '../components/page-elements/toast/elements';
import { Click } from '../interactions';

/**
 * This abstracts the actions relating to test assertions
 * @namespace Verify
 * @example Verify.theElement('LOGIN_BTN_SELECTOR').contains('Login')
 */
export default class Verify {
  /**
   * We pass the element into here and it returns functions we can call to assert the
   * element is behaving like its supposed to
   * @example Click.on(somethingThatDisablesBTN)
   * Verify.theElement('BTN').hasClass('Mui-Disabled')
   * @param {string} sel selector for the element you want to run an assertion against
   */
  static theElement = (sel, alias) => ({
    contains: (text) =>
      cy
        .get(sel)
        .as(alias || sel)
        .should('contain.text', text),
    hasValue: (text) =>
      cy
        .get(sel)
        .as(alias || sel)
        .should('have.value', text),
    doesntContain: (text) =>
      cy
        .get(sel)
        .as(alias || sel)
        .should('not.contain.text', text),
    // make a distincion between element having class and an elements child containing class
    hasClass: (cls) =>
      cy
        .get(sel)
        .as(alias || sel)
        .should('have.class', cls),
    appearsNTimes: (n) =>
      cy
        .get(sel)
        .as(alias || sel)
        .should('have.length', n),
    isVisible: () =>
      cy
        .get(sel)
        .as(alias || sel)
        .should('be.visible'),
    isNotExist: () =>
      cy
        .get(sel)
        .as(alias || sel)
        .should('not.exist'),
    isDisabled: () =>
      cy
        .get(sel)
        .as(alias || sel)
        .should('have.class', 'Mui-disabled'),
  });

  /**
   * Static method for specific validation actions against toasts.
   * Dismisses toasts after verification so they don't cover elements we need to interact with.
   * Verify that a toast shows up containing the text passed in
   * @example Verify.theToast.showsUpWithText('event sucessfully created')
   * @param {string} text text you want to make sure is included in the toast message
   */
  static theToast = {
    confirmsDeletion: () => {
      cy.wait(100);
      cy.url().should('not.include', 'events/events');
      cy.get(Toast.deletedToast)
        .as('Deletion confirmation toast')
        .should('be.visible');
      Click.on(Toast.dismiss, 'Toast Dismiss Btn');
    },
    confirmsCreation: () => {
      cy.wait(100);
      cy.url().should('not.include', 'events/events');
    },
    confirmsEditing: () => {
      cy.wait(100);
      cy.url().should('not.include', 'events/events');
      cy.get(Toast.editedToast)
        .as('Editing confirmation toast')
        .should('be.visible');
      Click.on(Toast.dismiss, 'Toast Dismiss Btn');
    },
    confirmsAttendeeAdded: () => {
      cy.wait(50);
      cy.get(Toast.addedAttendee)
        .as('Attendee added toast')
        .should('be.visible');
      Click.on(Toast.dismiss, 'Toast Dismiss Btn');
    },
    confirmsAttendeeRemoved: () => {
      cy.wait(50);
      cy.get(Toast.removedAttendee)
        .as('Attendee removed toast')
        .should('be.visible');
      Click.on(Toast.dismiss, 'Toast Dismiss Btn');
    },
    confirmsAttendeeMoved: () => {
      cy.wait(50);
      cy.get(Toast.movedAttendee).as('Attendee moved').should('be.visible');
      Click.on(Toast.dismiss, 'Toast Dismiss Btn');
    },
    confirmsAttendeeWithdrawn: () => {
      cy.get(Toast.withdrawnAttendeeFromEvent)
        .as('Attendee withdrawn')
        .should('be.visible');
      Click.on(Toast.dismiss, 'Toast Dismiss Btn');
    },
  };

  /**
   * Static method for specific validation actions against text.
   * @example Verify.thisText('big long string').contains('string') // assertion passes
   * @example Verify.thisText('big long string').equals('string') // assertion fails
   * @param {string} textToTest text you want to make sure contains other string
   */
  static thisText = (textToTest) => ({
    contains: (textItShouldContain) =>
      expect(textToTest).to.contain(textItShouldContain),
    equals: (textItShouldEqual) => expect(textToTest).to.eq(textItShouldEqual),
  });

  /**
   * Static method for specific validation actions against URLs.
   * @example Verify.theUrl('www.google.com/#fooBar').inclues('#fooBar') // assertion passes
   * @param {string} textToTest text you want to make sure contains other string
   */
  static theUrl = {
    includes: (text) => cy.url().should('include', text),
    doesntInclude: (text) => cy.url().should('not.include', text),
  };

  /**
   * Static method for specific validation actions against events
   * @example Verify.theEventNamed('EVENT NAME 2020').existsOnThisDate(new Date())
   * @param {string} textToTest text you want to make sure contains other string
   */
  static theEventNamed = (eventName) => ({
    existsOnThisDate: (eventDate) => {
      NavigateToDate(eventDate);
      cy.get(weekCalElements.WeekCalByDate(eventDate.date()))
        .as('Weekly Calendar')
        .within(() => {
          cy.get(weekCalElements.WeekCalEvent).contains(eventName);
        });
    },
  });
}

let NavigateToDate = (date) => {
  let _d = moment(date);
  let m = _d.format('MMMM');
  let d = _d.format('D');
  MonthCalComponent.navToMonth(m);
  MonthCalComponent.clickOnDay(d);
};
