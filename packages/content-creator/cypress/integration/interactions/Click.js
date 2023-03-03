/**
 * This abstracts clicking on an element
 * @namespace
 * @example import { Click } from '../interactions'
 * Click.on('#ID_OF_ELEMENT')
 */

export default class Click {
  /**
   * This triggers a normal click event on an element, uses
   * <a href="https://docs.cypress.io/api/commands/click.html" target="_blank">cy.get().click()</a>
   * @param {string} selector the selector for the element to click on
   */
  static on = selector => cy.get(selector).click();

  /**
   * This clicks but gives you a little extra time
   * <a href="https://docs.cypress.io/api/commands/click.html" target="_blank">cy.get().click()</a>
   * @param {string} selector the selector for the element to click on
   */
  static longWaitClickOn = selector => {
    Cypress.config('defaultCommandTimeout', 10000);
    cy.get(selector).click()
  };
  /**
   * This will click the first element that matches the selector you pass in
   * <a href="https://docs.cypress.io/api/commands/click.html" target="_blank">cy.get().click()</a>
   * @param {string} selector the selector for the element to click on
   */
  static onFirst = selector =>
    cy
      .get(selector)
      .first()
      .click();
  /**
   * This clicks on an element with the force param set to true in the case you
   * want to click something that is hidden by a modal (should only be used for cleanup)
   * @param {string} selector the selector for the element to click on
   */
  static forcefullyOn = selector => cy.get(selector).click({ force: true });

  /**
   * This double clicks on an element
   * @param {string} selector the selector for the element to double click on
   */
  static doubleClickOn = selector => cy.get(selector).dblclick();
}
