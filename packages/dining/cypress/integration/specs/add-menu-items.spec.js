/// <reference types="Cypress" />
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';
import {
  MenuInfo,
  RestaurantInfo,
  MenuItemsInfo,
  EditMenuItemInfo,
  CopyAndPasteMenuItems,
  ClearMenuCell,
} from '../utils/Consts';
import NewMenuSetupPage from '../components/page-handlers/menu-setup-page/index';
import InitialDiningPage from '../components/page-handlers/dining-page/index';
import RestaurantSetupPage from '../components/page-handlers/restaurants-setup-page/index';
import CreateMenuItemsPage from '../components/page-handlers/menu-items-page/index';

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

  it('CreatIng a new menuitem and adding it to the calander cell', function () {
    InitialDiningPage.clickOnRestaurantSetupBtn();
    RestaurantSetupPage.addNewRestaurant(RestaurantInfo);
    NewMenuSetupPage.addNewMenu(MenuInfo);
    CreateMenuItemsPage.menuCalandarScreenValidation(MenuInfo);
    CreateMenuItemsPage.createMenuItem(MenuItemsInfo);
    RestaurantSetupPage.clickOnEditRestaurantsBtn(RestaurantInfo);
    RestaurantSetupPage.deleteRestaurants(RestaurantInfo);
  });

  it('Searching for Existing menu items and adding it to the cell', function () {
    InitialDiningPage.clickOnRestaurantSetupBtn();
    RestaurantSetupPage.addNewRestaurant(RestaurantInfo);
    NewMenuSetupPage.addNewMenu(MenuInfo);
    CreateMenuItemsPage.menuCalandarScreenValidation(MenuInfo);
    CreateMenuItemsPage.addingNewMenuItems();
    RestaurantSetupPage.clickOnEditRestaurantsBtn(RestaurantInfo);
    RestaurantSetupPage.deleteRestaurants(RestaurantInfo);
  });

  it('Editing menu items and adding it to the cell', function () {
    InitialDiningPage.clickOnRestaurantSetupBtn();
    RestaurantSetupPage.addNewRestaurant(RestaurantInfo);
    NewMenuSetupPage.addNewMenu(MenuInfo);
    CreateMenuItemsPage.menuCalandarScreenValidation(MenuInfo);
    CreateMenuItemsPage.createMenuItem(MenuItemsInfo);
    CreateMenuItemsPage.editMenuItem(MenuInfo, MenuItemsInfo,EditMenuItemInfo);
    RestaurantSetupPage.clickOnEditRestaurantsBtn(RestaurantInfo);
    RestaurantSetupPage.deleteRestaurants(RestaurantInfo);
  });

  it('Copy and past the menu items from one cell to another', function () {
    InitialDiningPage.clickOnRestaurantSetupBtn();
    RestaurantSetupPage.addNewRestaurant(RestaurantInfo);
    NewMenuSetupPage.addNewMenu(MenuInfo);
    CreateMenuItemsPage.menuCalandarScreenValidation(MenuInfo);
    CreateMenuItemsPage.addingNewMenuItems();
    CreateMenuItemsPage.copyAndPaste(CopyAndPasteMenuItems);
    RestaurantSetupPage.clickOnEditRestaurantsBtn(RestaurantInfo);
    RestaurantSetupPage.deleteRestaurants(RestaurantInfo);
  });

  it('Clear menu items from a cell ', function () {
    InitialDiningPage.clickOnRestaurantSetupBtn();
    RestaurantSetupPage.addNewRestaurant(RestaurantInfo);
    NewMenuSetupPage.addNewMenu(MenuInfo);
    CreateMenuItemsPage.menuCalandarScreenValidation(MenuInfo);
    CreateMenuItemsPage.addingNewMenuItems();
    CreateMenuItemsPage.clearMenucell(ClearMenuCell);
    RestaurantSetupPage.clickOnEditRestaurantsBtn(RestaurantInfo);
    RestaurantSetupPage.deleteRestaurants(RestaurantInfo);
  });
});
