/** @format */
/// <reference types="Cypress" />
import { Auth } from '../utils';
import SettingsPageComponent from '../components/page-handler/settings-page';
import { UrlOptions } from '../utils/SetupBrowser';
import { settings } from '../utils/Consts';

context(`SETTINGS | LOCATIONS ->`, () => {
  UrlOptions.url = UrlOptions.url + '/settings/locations/';
  before(() => {
    Auth.user();
    UrlOptions.onLoad(window);
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('jwt', 'session');
    cy.visit(UrlOptions);
    cy.reload();
  });

  it(`Add Edit and Delete a new Location`, () => {
    SettingsPageComponent.newLocationNamed(
      settings.EVENT_LOCATION_NAME,
    ).abbreviated('ABC');
    SettingsPageComponent.searchRow(settings.EVENT_LOCATION_NAME);
    SettingsPageComponent.editLastRow(
      settings.EDITED_EVENT_LOCATION_NAME,
      'ELN',
    );
    SettingsPageComponent.deleteLastRow(settings.EDITED_EVENT_LOCATION_NAME);
  });
});
