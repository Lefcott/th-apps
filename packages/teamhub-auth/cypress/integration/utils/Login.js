/** @format */
const ENV = Cypress.env('ENVIRONMENT');
const defaultCommunityId = Cypress.env('communityId')[ENV];
/**
 * Snag the env variable we set during setup in commands.js and put it in a cookie
 * @namespace
 */
export default class Login {
  /**
   * This authorizes the user
   */

  static asUser = (userName) => {
    cy.fixture('users/' + userName).then((user) => {
      cy.login(user.email, user.password);
      this.user = user;
    });
    return {
      toDefaultCommunity: () => {
        setCommunity(defaultCommunityId);
      },
      toCommunity: (id) => {
        setCommunity(id);
      },
    };
  };
}

let setCommunity = (communityId) =>
  Cypress.env('selectedCommunity', communityId);
