/** @format */
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';
import {MenuInfo, RestaurantInfo, EditMenuInfo} from '../utils/Consts';
import NewMenuSetupPage from '../components/page-handlers/menu-setup-page/index';
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

  it('Validates Initial MenuSetup page', function () {
    InitialDiningPage.clickOnRestaurantSetupBtn();
    RestaurantSetupPage.addNewRestaurant(RestaurantInfo);
    NewMenuSetupPage.newMenuVerification();
    RestaurantSetupPage.clickOnEditRestaurantsBtn(RestaurantInfo);
    RestaurantSetupPage.deleteRestaurants(RestaurantInfo);
  });

  it('Add a new menu to the restaurant', function () {
    InitialDiningPage.clickOnRestaurantSetupBtn();
    RestaurantSetupPage.addNewRestaurant(RestaurantInfo);
    NewMenuSetupPage.addNewMenu(MenuInfo);
    NewMenuSetupPage.deleteMenu(MenuInfo);
    RestaurantSetupPage.clickOnEditRestaurantsBtn(RestaurantInfo);
    RestaurantSetupPage.deleteRestaurants(RestaurantInfo);
  });

  it('Edit an existing menu and delete the menu under the restaurant', function () {
    InitialDiningPage.clickOnRestaurantSetupBtn();
    RestaurantSetupPage.addNewRestaurant(RestaurantInfo);
    NewMenuSetupPage.addNewMenu(MenuInfo);
    NewMenuSetupPage.editMenu(EditMenuInfo);
    NewMenuSetupPage.deleteMenu(EditMenuInfo);
    RestaurantSetupPage.clickOnEditRestaurantsBtn(RestaurantInfo);
    RestaurantSetupPage.deleteRestaurants(RestaurantInfo);
  });
});
