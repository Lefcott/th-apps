/** @format */
/// <reference types="Cypress" />
import { Auth } from '../utils';
import { UrlOptions } from '../utils/SetupBrowser';
import EventManagerPage from '../components/page-handler/event-model';

context(
  'we should be able to add a calendar and event type and location',
  () => {
    before(() => {
      Auth.user();
      UrlOptions.onLoad(window);
    });

    beforeEach(() => {
      Cypress.Cookies.preserveOnce('jwt', 'session');
      cy.visit(UrlOptions);
      cy.reload();
      cy.intercept('/calendars/month*', (req) => {
        req.headers['Authorization'] = `Bearer: ${Cypress.env('TOKEN')}`;
        req.continue();
      });
    });

    it.only(`Click on monthly calendar preview, And validates`, () => {
     cy.wait(10000);
     EventManagerPage.openPreviewMonthlyCalendar();
     EventManagerPage.verifyPreviewMonthlyCalendar();
    });
  }
);
