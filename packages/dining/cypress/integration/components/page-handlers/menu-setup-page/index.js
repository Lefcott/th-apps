/** @format */
import { Verify } from '../../../assertions';
import { Click, Type } from '../../../interactions';
import { MENU_MESSAGES } from '../../../utils/Consts';
import MenuPageElements from '../../page-elements/menu-page/elements';
import RestaurantSetupElements from '../../page-elements/restaurants-setup-page/elements';
import SnackbarElements from '../../page-elements/snack-bar/elements';
/**
 * This abstracts has the actions relating to the Dining
 * @namespace MenuPage
 */
export default class NewMenuSetupPage {
  
   static addNewMenu = (NewMenu) => {
    NewMenu.MenuName = `${NewMenu.MenuName}-${Date.now().toString().slice(-5)}`;
    Verify.theElement(MenuPageElements.newMenuBtn).isVisible();
    Verify.theElement(MenuPageElements.menuPageText).contains(MENU_MESSAGES.MENU_SETUP_TEXT);
    Click.on(MenuPageElements.newMenuBtn);
    Verify.theElement(MenuPageElements.menuSetupHeadertext).contains(MENU_MESSAGES.MENU_SETUP_HEADER_TEXT);
    this.editRestaurantName(NewMenu.RestaurantName),
    this.editMenuName(NewMenu.MenuName);
    Click.on(MenuPageElements.startDate);
    NewMenuSetupPage.enterStartDate();
    this.editMenuCycle(NewMenu.MenuCycle);
    this.editMenuRepeatCycle(NewMenu.MenuRepeatCycle);
    this.editFirstMeal(NewMenu.FirstMeal);
    this.editSecondMeal(NewMenu.SecondMeal);
    this.editThirdMeal(NewMenu.ThirdMeal);
    this.editAudience(NewMenu.Audience);
    Click.forcefullyOn(MenuPageElements.menuSaveBtn);
    Verify.theElement(SnackbarElements.createSuccessSnackbar).isVisible();
    Click.on(SnackbarElements.dismissSnackbar);
  };

  static editMenu = (NewMenu) => {
    Click.on(MenuPageElements.menuEditIcon);
    this.editRestaurantName(NewMenu.RestaurantName),
    this.editMenuName(NewMenu.MenuName);
    Click.on(MenuPageElements.startDate);
    NewMenuSetupPage.enterStartDate();
    this.editMenuCycle(NewMenu.MenuCycle);
    this.editMenuRepeatCycle(NewMenu.MenuRepeatCycle);
    this.editFirstMeal(NewMenu.FirstMeal);
    this.editSecondMeal(NewMenu.SecondMeal);
    this.editThirdMeal(NewMenu.ThirdMeal);
    this.editAudience(NewMenu.Audience);
    Click.forcefullyOn(MenuPageElements.menuSaveBtn);
    Verify.theElement(SnackbarElements.createSuccessSnackbar).isVisible();
    Click.on(SnackbarElements.dismissSnackbar);
  };

  static editRestaurantName = (restaurantname) => {
  if (restaurantname) {
    Click.on(MenuPageElements.newMenuSetup.restaurantName);
    Click.onContainsText(MenuPageElements.newMenuSetup.selectRestaurantName, restaurantname);
  }
};

  static editMenuName = (menuName) => {
    if (menuName) {
      Type.theText(menuName).into(MenuPageElements.newMenuSetup.menuName); 
    }
  };
  
   static enterStartDate = () => {
    const date = new Date();
    let currentWeekSunday =
      date.getDate().toString() - date.getDay().toString();
    let currentMonth = date.getMonth() + 1;
    if (parseInt(currentMonth) < 10) {
      currentMonth = '0' + currentMonth;
    }
    if (parseInt(currentWeekSunday) < 10) {
      currentWeekSunday = '0' + currentWeekSunday;
    }
    let currentSunday =
      currentMonth.toString() + currentWeekSunday + date.getFullYear();
    Type.theText(currentSunday).into(MenuPageElements.startDate);
  };

  static editMenuCycle = (menuCycle) => {
    if (menuCycle && menuCycle[0] !== '1 Week'){ 
      Click.on(MenuPageElements.menuCycleSetting.menuCycle);
      Click.onContainsText(MenuPageElements.menuCycleSetting.selectemenuCycle,menuCycle);
    }
  };

  static editMenuRepeatCycle = (menuRepeatCycle) => {
    if (menuRepeatCycle) {
      Type.theText(menuRepeatCycle).into(MenuPageElements.menuCycleSetting.repeatCycle); 
    }
  };

  static editFirstMeal = (firstMeal) => {
    if (firstMeal && firstMeal[0] !== 'Breakfast'){
      Click.on(MenuPageElements.menuMealsSettings.fristMeal);
      Click.onContainsText(MenuPageElements.menuMealsSettings.selectFristMeal,firstMeal);
    }
  };

  static editSecondMeal = (secondMeal) => {
    if (secondMeal && secondMeal[0] !== 'Lunch') {
      Click.on(MenuPageElements.menuMealsSettings.secondMeal);
      Click.onContainsText(MenuPageElements.menuMealsSettings.selectSecondMeal,secondMeal);
    }
  };

  static editThirdMeal = (thirdMeal) => {
    if (thirdMeal && thirdMeal[0] !== 'Dinner'){
      Click.on(MenuPageElements.menuMealsSettings.thirdMeal);
      Click.onContainsText(MenuPageElements.menuMealsSettings.selectThridMeal,thirdMeal);
    } 
  };

  static editAudience = (audience) => {
    if (audience) {
      audience.forEach(aud => {
        Click.onContainsText(MenuPageElements.newMenuSetup.audience,aud); 
        });
    }
  };

  static deleteMenu = (NewMenu) => {
    Click.on(MenuPageElements.deleteMenuBtn);
    Verify.theElement(MenuPageElements.deleteMenuConfirmationText).contains(NewMenu.MenuName);
    Click.on(MenuPageElements.deleteConfirmBtn);
    Verify.theElement(SnackbarElements.deleteSuccessSnackbar).isVisible();
    Click.on(SnackbarElements.dismissSnackbar);
  };

  static newMenuVerification = () => {
    Verify.theElement(MenuPageElements.menuImage).isVisible();
    Verify.theElement(MenuPageElements.menuPageText).contains(
      MENU_MESSAGES.MENU_SETUP_TEXT
    );
    Click.on(MenuPageElements.newMenuBtn);
    Verify.theElement(MenuPageElements.menuSetupHeadertext).contains(
      MENU_MESSAGES.MENU_SETUP_HEADER_TEXT
    );
    Click.on(MenuPageElements.menuPanelCancelBtn);
    Click.forcefullyOn(RestaurantSetupElements.confirmCancelBtn);
  };
}
