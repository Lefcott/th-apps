/**
 * This abstracts clicking on an element
 *
 * @format
 * @namespace
 * @example import { Click } from '../interactions' Click.on('#ID_OF_ELEMENT')
 */

export default class Click {
  /**
   * This triggers a normal click event on an element, uses
   * <a href="https://docs.cypress.io/api/commands/click.html" target="_blank">cy.get().click()</a>
   * @param {string} selector the selector for the element to click on
   */
  static on = (selector, alias) =>
    cy
      .get(selector)
      .as(alias || selector)
      .click();
  /**
   * This method clicks on the first element from the list of elements returned
   * @param {string} selector the selector for the element to click onFirstElement
   */
  static onFirstElement = (selector) =>
    cy.get(selector).first().click({ force: true });

  static onLastElement = (selector) =>
    cy.get(selector).last().click({ force: true });
  /**
   * This clicks on an element with the force param set to true in the case you
   * want to click something that is hidden by a modal (should only be used for cleanup)
   * @param {string} selector the selector for the element to click on
   */
  static forcefullyOn = (selector, alias) =>
    cy
      .get(selector)
      .as(alias || selector)
      .get(selector, alias)
      .click({ force: true });

  static onContainsText = (selector, text) =>
    cy.get(selector).contains(text).click();

  static onFirstContainsText = (selector, text) =>
    cy.get(selector).contains(text).first().click();

  static onClickMouseOverElement = (selector) =>
    cy.wait(5000).get(selector).invoke('show').first().click({ force: true });
}
