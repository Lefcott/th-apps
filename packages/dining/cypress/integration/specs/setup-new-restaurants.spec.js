/** @format */
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';
import RestaurantSetupPage from '../components/page-handlers/restaurants-setup-page/index';
import {
  RestaurantInfoWithResidentGroup,
  RestaurantInfo,
  EditRestaurantInfo,
} from '../utils/Consts';
import InitialDiningPage from '../components/page-handlers/dining-page/index';

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

  it('Add a new restaurant with all Resident Group', function () {
    InitialDiningPage.clickOnRestaurantSetupBtn();
    RestaurantSetupPage.addNewRestaurant(RestaurantInfo);
    RestaurantSetupPage.verifyRestaurantName(RestaurantInfo);
    RestaurantSetupPage.clickOnEditRestaurantsBtn(RestaurantInfo);
    RestaurantSetupPage.deleteRestaurants(RestaurantInfo);  
  });

  it('Add a new restaurant with selected Resident Groups', function () {
    InitialDiningPage.clickOnRestaurantSetupBtn();
    RestaurantSetupPage.addNewRestaurant(RestaurantInfoWithResidentGroup);
    RestaurantSetupPage.verifyRestaurantName(RestaurantInfoWithResidentGroup);
    RestaurantSetupPage.clickOnEditRestaurantsBtn(RestaurantInfoWithResidentGroup);
    RestaurantSetupPage.deleteRestaurants(RestaurantInfoWithResidentGroup);
  });

  it('Edit a restaurant', function () {
    InitialDiningPage.clickOnRestaurantSetupBtn();
    RestaurantSetupPage.addNewRestaurant(RestaurantInfo);
    RestaurantSetupPage.clickOnEditRestaurantsBtn(RestaurantInfo);
    RestaurantSetupPage.verifyRestaurantName(RestaurantInfo);
    RestaurantSetupPage.editRestaurant(EditRestaurantInfo);
    RestaurantSetupPage.closeWithconfirmCancel();
    RestaurantSetupPage.clickOnEditRestaurantsBtn();
    RestaurantSetupPage.deleteRestaurants(EditRestaurantInfo);
  });
});
