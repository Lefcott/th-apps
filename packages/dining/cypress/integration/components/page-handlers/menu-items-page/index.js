import { Verify } from '../../../assertions';
import { Click, Type } from '../../../interactions';
import {MenuItemsInfo } from '../../../utils/Consts';
import MenuPageElements from '../../page-elements/menu-page/elements';
import SnackbarElements from '../../page-elements/snack-bar/elements';
import MenuItemsPageElements from '../../page-elements/menu-items-page/elements';
export default class CreateMenuItemsPage {

  static menuCalandarScreenValidation = (menu) => {
    Verify.theElement(MenuItemsPageElements.mealNameHeader).isNthElementPresent(0,menu.FirstMeal);
    Verify.theElement(MenuItemsPageElements.mealNameHeader).isNthElementPresent(1,menu.SecondMeal);
    Verify.theElement(MenuItemsPageElements.mealNameHeader).isNthElementPresent(2,menu.ThirdMeal);
    Verify.theElement(MenuPageElements.deleteMenuBtn).isVisible();
  };

  static addingNewMenuItems = () => {
    Click.nthElement(MenuItemsPageElements.addMenuitemicon, 1);
    Click.on(MenuItemsPageElements.addMenuItem);
    Type.theText(MenuItemsInfo.menuItemName).into(
      MenuItemsPageElements.addMenuItem
    );
    Click.on(MenuItemsPageElements.existingMenuItem);
    Click.forcefullyOn(MenuItemsPageElements.menuItemSaveBtn);
  };

  static createMenuItem = (MenuItems) => {
    MenuItems.NewMenuItemName = `${MenuItems.NewMenuItemName}-${Date.now().toString().slice(-5)}`;
    Click.nthElement(MenuItemsPageElements.addMenuitemicon, 1);
    Click.on(MenuItemsPageElements.addMenuItem);
    Type.theText(MenuItems.NewMenuItemName).into(MenuItemsPageElements.addMenuItem);
    Click.on(MenuItemsPageElements.createNewMenuItem);
    Click.on(MenuItemsPageElements.categoryDropDown);
    Verify.theElement(MenuItemsPageElements.selectCategoryOptions).contains(MenuItemsInfo.ItemCategory);
    Click.onContainsText(MenuItemsPageElements.selectCategoryOptions,MenuItemsInfo.ItemCategory);
    Click.on(MenuItemsPageElements.menuItemDesceription);
    Type.theText(MenuItems.ItemDescription).into(MenuItemsPageElements.menuItemDesceription);
    Click.forcefullyOn(MenuItemsPageElements.menuItemSaveBtn);
    Verify.theElement(SnackbarElements.createSuccessSnackbar).isVisible();
    Click.on(SnackbarElements.dismissSnackbar);
    Click.forcefullyOn(MenuItemsPageElements.menuItemSaveBtn);
    Verify.theElement(SnackbarElements.updateSuccessSnackbar).isVisible();
    Click.on(SnackbarElements.dismissSnackbar);
  };

  static editMenuItem = (MenuInfo, MenuItemsInfo, EditMenuItemInfo) => {
    Click.onContainsText(MenuItemsPageElements.oneditIconclick + MenuInfo.FirstMeal,MenuItemsInfo.NewMenuItemName);
    Click.on(MenuItemsPageElements.reeditIcon + MenuInfo.FirstMeal + '-edit');
    Click.nthElement(MenuItemsPageElements.addMenuitemicon, 1);
    Click.on(MenuItemsPageElements.editMenuitemKebab);
    Click.onFirst(MenuItemsPageElements.clickOnKebab);
    Click.onContainsText(MenuItemsPageElements.editIteamName, 'Edit Item');
    Click.on(MenuItemsPageElements.selectItem);
    Type.theText(EditMenuItemInfo.EditedMenuItemName).into(MenuItemsPageElements.selectItem);
    Click.on(MenuItemsPageElements.categoryDropDown);
    Verify.theElement(MenuItemsPageElements.selectCategoryOptions).contains(EditMenuItemInfo.EditedItemCategory);
    Click.onContainsText(MenuItemsPageElements.selectCategoryOptions,EditMenuItemInfo.EditedItemCategory);
    Click.forcefullyOn(MenuItemsPageElements.menuItemSaveBtn);
    Verify.theElement(SnackbarElements.editSuccessSnackbar).isVisible();
    Click.on(SnackbarElements.dismissSnackbar);
    Click.forcefullyOn(MenuItemsPageElements.menuItemSaveBtn);
  };

  static copyAndPaste = (menuCellDetails) => {
   let copyFrom = menuCellDetails.CopyFromCell + '-' + menuCellDetails.CopyFromMealName;
   let pasteTo = menuCellDetails.PasteToCell + '-' + menuCellDetails.PasteToMealName;

    Click.on(MenuItemsPageElements.menuCell.replace('%s', copyFrom));
    Click.on(MenuItemsPageElements.menuCellAction.replace('%s', copyFrom));
    Click.on(MenuItemsPageElements.copyMenuCell.replace('%s', copyFrom));
    Click.on(MenuItemsPageElements.menuCell.replace('%s', pasteTo));
    Click.on(MenuItemsPageElements.menuCellAction.replace('%s', pasteTo));
    Click.on(MenuItemsPageElements.pasteMenuCell.replace('%s', pasteTo));
    Verify.theElement(SnackbarElements.createSuccessSnackbar).isVisible();
    Click.on(SnackbarElements.dismissSnackbar);
  };

  static clearMenucell = (clearCellDetails) => {
    let clearCell = clearCellDetails.ClearFromCell + '-' + clearCellDetails.ClearFromMealName; 
    Click.on(MenuItemsPageElements.menuCell.replace('%s', clearCell));
    Click.on(MenuItemsPageElements.menuCellAction.replace('%s', clearCell));
    Click.on(MenuItemsPageElements.clearMenuCellIcon.replace('%s', clearCell));
    Click.on(MenuItemsPageElements.confirmClear);
    Verify.theElement(SnackbarElements.createSuccessSnackbar).isVisible();
    Click.on(SnackbarElements.dismissSnackbar);
  };
}
