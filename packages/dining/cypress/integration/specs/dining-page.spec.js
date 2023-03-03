/** @format */

import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';
import InitialDiningPage from '../components/page-handlers/dining-page/index';
import RestaurantSetupPage from '../components/page-handlers/restaurants-setup-page/index';
context('Dining tests!', function () {
  before(() => {
    UrlOptions.onBeforeLoad(window);
    UrlOptions.onLoad(window);
  });
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    cy.reload();
  });
  it('Opens Dining Page validats Initial RestaurantSetup ', function () {
    InitialDiningPage.validateDiningPage();
    InitialDiningPage.clickOnRestaurantSetupBtn();
    RestaurantSetupPage.clickOnCloseBtn();
  });
});
