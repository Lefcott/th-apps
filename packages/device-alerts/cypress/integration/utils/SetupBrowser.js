/** @format */

const env = Cypress.env("ENVIRONMENT");
const QUERY_PARAMS = Cypress.config("queryParams");
const url = Cypress.env("CYPRESS_BASE_URL")[env];
export const UrlOptions = {
  url,
  qs: QUERY_PARAMS[env],
  onLoad: (w) => {
    try {
      w.localStorage.setItem(
        "selectedCommunity",
        QUERY_PARAMS[env].communityId
      );
      w.localStorage.setItem("devtools", true);
      if (env === "local") {
        w.importMapOverrides.addOverride(
          "@teamhub/device-alerts",
          `https://localhost:${Cypress.env("PORT")}/teamhub-device-alerts.js`
        );
        w.importMapOverrides.addOverride(
          "@teamhub/device-alerts/",
          `https://localhost:${Cypress.env("PORT")}/teamhub-device-alerts.js`
        );
        cy.reload();
      }
    } catch (error) {
      console.log("___-_-_error_-_-___ :\n\n\n", error, "\n\n");
    }
  },
};
