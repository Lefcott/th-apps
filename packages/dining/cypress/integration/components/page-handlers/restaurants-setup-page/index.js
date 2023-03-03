/** @format */
import { Verify } from '../../../assertions';
import { Click, Type } from '../../../interactions';
import RestaurantSetupElements from '../../page-elements/restaurants-setup-page/elements';
import SnackbarElements from '../../page-elements/snack-bar/elements';
import DiningPageElements from '../../page-elements/dining-page/elements';
export default class RestaurantSetupPage {

  static clickOnCloseBtn = () => {
    Click.forcefullyOn(RestaurantSetupElements.restaurantCloseBtn);
  };

  static closeWithconfirmCancel = () => {
    Click.forcefullyOn(RestaurantSetupElements.restaurantCloseBtn);
    Verify.theElement(SnackbarElements.createSuccessSnackbar).isVisible();
    Click.forcefullyOn(RestaurantSetupElements.confirmCancelBtn);
    Verify.theElement(RestaurantSetupElements.restaurantNamefeeddata).contains(
      'Edited'
    );
  };
  
  static clickOnEditRestaurantsBtn = () => {
    Click.on(RestaurantSetupElements.editRestaurantBtn);
  };
  
  static addNewRestaurant = (Restaurant) => {
    Restaurant.RestaurantName = `${Restaurant.RestaurantName}-${Date.now().toString().slice(-5)}`;
    Click.on(RestaurantSetupElements.newRestaurantSetup.restaurantAddBtn);
    this.editRestaurantName(Restaurant.RestaurantName);
    this.editresidentGroups(Restaurant.ResidentGroup);
    Click.on(RestaurantSetupElements.newRestaurantSetup.restaurantSaveBtn);
    Verify.theElement(SnackbarElements.createSuccessSnackbar).isVisible();
    Click.on(SnackbarElements.dismissSnackbar);
  };
  
  static verifyRestaurantName = (Restaurant) => {
    Verify.theElement(RestaurantSetupElements.restaurantNamefeeddata).contains(
      Restaurant.RestaurantName
    );
  };
 
  static editRestaurant = (Restaurant) => {
    Restaurant.RestaurantName = `${Restaurant.RestaurantName}-${Date.now().toString().slice(-5)}`;
    this.editRestaurantName(Restaurant.EditedRestaurantName);
    this.editresidentGroups(Restaurant.EditedResidentGroup);
    Click.on(RestaurantSetupElements.newRestaurantSetup.restaurantSaveBtn);
  };
 
  static deleteRestaurants = () => {
    Click.on(RestaurantSetupElements.deleteRestaurantBtn);
    Verify.theElement(
      RestaurantSetupElements.deleteRestaurantWaringIocn
    ).isVisible();
    Click.forcefullyOn(RestaurantSetupElements.deleteConfirmationBtn);
    Verify.theElement(SnackbarElements.deleteSuccessSnackbar).isVisible();
    Click.on(SnackbarElements.dismissSnackbar);
    Verify.theElement(DiningPageElements.restaurantSetupBtn).isVisible();
  };

  static editRestaurantName = (restaurantName) => {
    Type.theText(restaurantName).into(
      RestaurantSetupElements.newRestaurantSetup.restaurantName
    );
  };

  static editresidentGroups = (residentGroups) => {
    if (residentGroups[0] !== 'All Resident Groups') {
      Click.on(RestaurantSetupElements.residentGroups.dropdownEle);
      Click.on(RestaurantSetupElements.residentGroups.allResidentGroups);
      residentGroups.forEach((residentGroup) => {
        Click.onContainsText(
          RestaurantSetupElements.residentGroups.selectResidentGroup,
          residentGroup
        );
      });
      Click.on('body');
      Verify.list(
        RestaurantSetupElements.residentGroups.selectedResidentGroup,
        residentGroups
      );
    }
  };
}

