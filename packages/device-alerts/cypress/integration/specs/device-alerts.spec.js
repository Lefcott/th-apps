/** @format */

/// <reference types="Cypress" />

import { Auth } from "../utils";
import { Click, Type } from "../interactions";
import { BA, BuildingAlerts } from "../components";
import { UrlOptions } from "../utils/SetupBrowser";

context("Device Alerts", () => {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
  });

  it(`Make sure the UI loads`, () => {
    BuildingAlerts.searchFor("name");
    BuildingAlerts.goToSettings();
  });
});
