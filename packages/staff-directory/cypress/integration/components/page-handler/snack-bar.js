/**
 * This abstracts the actions relating to the Snackbar
 *
 * @format
 * @namespace Snackbar
 */

export default class Snackbar {
  /**
   * Method to get the text of the loading modal
   */
  static getText = () => cy.get(T.Snackbar).text();
}
