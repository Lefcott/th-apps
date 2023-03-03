/** @format */

import { Toast } from "../components/";
import { Click } from "../interactions";

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
        .should("contain.text", text),
    hasValue: (text) =>
      cy
        .get(sel)
        .as(alias || sel)
        .should("have.value", text),
    doesntContain: (text) =>
      cy
        .get(sel)
        .as(alias || sel)
        .should("not.contain.text", text),
    // make a distincion between element having class and an elements child containing class
    hasClass: (cls) =>
      cy
        .get(sel)
        .as(alias || sel)
        .should("have.class", cls),
    appearsNTimes: (n) =>
      cy
        .get(sel)
        .as(alias || sel)
        .should("have.length", n),
    isVisible: () =>
      cy
        .get(sel)
        .as(alias || sel)
        .should("be.visible"),
    isDisabled: () =>
      cy
        .get(sel)
        .as(alias || sel)
        .should("have.class", "Mui-disabled"),
  });

  /**
   * Static method for specific validation actions against toasts.
   * Dismisses toasts after verification so they don't cover elements we need to interact with.
   * Verify that a toast shows up containing the text passed in
   * @example Verify.theToast.showsUpWithText('event sucessfully created')
   * @param {string} text text you want to make sure is included in the toast message
   */

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
    includes: (text) => cy.url().should("include", text),
    doesntInclude: (text) => cy.url().should("not.include", text),
  };
}
