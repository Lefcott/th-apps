/** @format */
import { Verify } from '../../../assertions';
import { Click } from '../../../interactions';
import DiningPageElements from '../../page-elements/dining-page/elements';
import RestaurantSetupElements from '../../page-elements/restaurants-setup-page/elements';
import { DINING_MESSAGES } from '../../../utils/Consts';
/**
 * This abstracts has the actions relating to the Dining
 * @namespace InitialDiningPage
 */
export default class DigingPage {
  /**
   * Method to verify the dining page
   */
  static validateDiningPage = () => {
    Verify.theElement(DiningPageElements.diningHeader).contains(
      DINING_MESSAGES.DINING_HEADER_TEXT
    );
    Verify.theElement(DiningPageElements.diningEmptyText).contains(
      DINING_MESSAGES.DINING_EMPTY_TEXT
    );
    Verify.theElement(DiningPageElements.diningImage).isVisible();
  };
  /**
   * Method is click on Setup restaurant and verify the restaurant setup pannel
   */
  static clickOnRestaurantSetupBtn = () => {
    Verify.theElement(DiningPageElements.diningImage).isVisible();
    Verify.theElement(DiningPageElements.restaurantSetupBtn).isVisible();
    Click.on(DiningPageElements.restaurantSetupBtn);
    Verify.theElement(RestaurantSetupElements.setupRestaurantText).contains(
      DINING_MESSAGES.RESTAURANT_SETUP_TEXT
    );
  };
}
