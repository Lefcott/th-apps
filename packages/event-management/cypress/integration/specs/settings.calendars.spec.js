/** @format */
/// <reference types="Cypress" />
import { Auth } from '../utils';
import SettingsPageComponent from '../components/page-handler/settings-page';
import { UrlOptions } from '../utils/SetupBrowser';
import { settings } from '../utils/Consts';

context(`SETTINGS | CALENDARS ->`, () => {
  UrlOptions.url = UrlOptions.url + '/settings/calendars/';
  before(() => {
    Auth.user();
    UrlOptions.onLoad(window);
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('jwt', 'session');
    cy.visit(UrlOptions);
    cy.reload();
  });

  it(`Add, Edit and delete a new Calendars`, () => {
    SettingsPageComponent.newCalendarNamed(settings.EVENT_CALENDAR_NAME);
    SettingsPageComponent.searchRow(settings.EVENT_CALENDAR_NAME);
    SettingsPageComponent.editLastRow(settings.EDITED_EVENT_CALENDAR_NAME);
    SettingsPageComponent.deleteLastRow(settings.EDITED_EVENT_CALENDAR_NAME);
  });
});
