/** @format */

import { TestCleanup } from '../utils';
import { T } from '../components';
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

  static theElement = (sel, n = 0) => ({
    contains: (text) => cy.get(sel).should('contain.text', text),
    containsVar: (variable) =>
      cy.get(variable).then((v) => cy.get(sel).should('contain.text', v)),
    hasValue: (text) => cy.get(sel).should('have.value', text),
    doesntContain: (text) => cy.get(sel).should('not.contain.text', text),
    // make a distincion between element having class and an elements child containing class
    hasClass: (cls) => cy.get(sel).should('have.class', cls),

    hasCSSProp: (prop) => ({
      withValue: (val) => cy.get(sel).should('have.css', prop, val),
    }),
    doesntHaveCSSProp: (prop) => ({
      withValue: (val) => cy.get(sel).should('not.have.css', prop, val),
    }),
    //hasCssProp: (prop, val) => cy.get(sel).eq(n).should('have.css', prop, val),
    appearsNTimes: (n) => cy.get(sel).should('have.length', n),
    hasItsFirstElContain: (n) => cy.get(sel).first().should('contain.text', n),
    isVisible: () => {
      cy.get(sel).should('be.visible');
    },
    isntVisible: (timeout) => {
      cy.get(sel, timeout ? { timeout } : {}).should('not.be.visible');
    },
    exists: () => {
      cy.get(sel).should('exist');
    },
    doesntExist: () => {
      cy.get(sel).should('not.exist');
    },
    isDisabled: () => cy.get(sel).should('have.class', 'Mui-disabled'),
  });

  /**
   * Static method for specific validation actions against toasts.
   * Dismisses toasts after verification so they don't cover elements we need to interact with.
   * Verify that a toast shows up containing the text passed in
   * @example Verify.theToast.showsUpWithText('content created')
   * @param {string} text text you want to make sure is included in the toast message
   */
  static theToast = {
    showsUpWithText: (text) => {
      cy.get(T.containing(text)).should('be.visible');
    },
    doesntShowUpWithText: (text) => {
      cy.get(T.containing(text)).should('not.be.visible');
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
  static theUrl = { includes: (text) => cy.url().should('include', text) };
}
