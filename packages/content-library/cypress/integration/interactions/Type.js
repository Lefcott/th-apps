/**
 * This abstracts Typing text into an element
 * @namespace
 * @example import Type from '../interactions'
 * Type.theText('TEXT').into('#ELEMENT')
 * @returns {Promise} Should execute the Cypress command <a href="https://docs.cypress.io/api/commands/type.html" target="_blank">cy.get(SELECTOR).clear().type(TEXT)</a>
 */
export default class Type {
  /**
   * @param {string} text the text you want entered into the element
   * @property {function(string)} into the function returned by `theText`;
   * Allows you to specify the element we are trying to enter `text` into.
   */
  static theText = text => ({
    into: selector =>
      cy
        .get(selector)
        .clear()
        .type(text),
  });
}
