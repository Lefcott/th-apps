/** @format */
/// <reference types="Cypress" />
import { Auth } from '../utils';
import SettingsPageComponent from '../components/page-handler/settings-page';
import { UrlOptions } from '../utils/SetupBrowser';
import { settings } from '../utils/Consts';

context(`SETTINGS | EVENT TYPES ->`, () => {
  UrlOptions.url = UrlOptions.url + '/settings/event-types/';

  before(() => {
    Auth.user();
    UrlOptions.onLoad(window);
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('jwt', 'session');
    cy.visit(UrlOptions);
    cy.reload();
  });

  it(`Add, Edit and delete a new Event Type`, () => {
    SettingsPageComponent.newEventTypeNamed(settings.EVENT_TYPE_NAME);
    SettingsPageComponent.searchRow(settings.EVENT_TYPE_NAME);
    SettingsPageComponent.editLastRow(settings.EDITED_EVENT_TYPE_NAME);
    SettingsPageComponent.deleteLastRow(settings.EDITED_EVENT_TYPE_NAME);
  });
});
