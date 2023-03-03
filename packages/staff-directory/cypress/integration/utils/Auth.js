/** @format */

/**
 * Snag the env variable we set during setup in commands.js and put it in a cookie
 * @namespace
 */
export default class Auth {
  /**
   * This authorizes the user
   */
  static user = () => {
    console.log(Cypress.env('TOKEN'));
    if (!Cypress.env('TOKEN')) {
      console.log('No token!');
    }
    cy.setCookie('jwt', Cypress.env('TOKEN'));
  };
}
