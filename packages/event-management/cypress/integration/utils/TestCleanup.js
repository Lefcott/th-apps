/** @format */

const TestCleanup = (hard) => {
  cy.deleteEventsForThisCommunity();
};

export default TestCleanup;
