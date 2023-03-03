/** @format */
//This method has all display test and message associated to dining module
export const DINING_MESSAGES = {
  DINING_HEADER_TEXT: 'Dining',
  RESTAURANT_SETUP_TEXT: 'Setup Restaurants',
  DINING_EMPTY_TEXT: 'Your dining room is looking empty.',
};
export const RESTAURANT_MESSAGES = {
  RESTAURANT_DELETE_WARNING_TEXT:
    'WARNING: Deleting will remove this restaurant. This Action cannot be undone.',
};
export const MENU_MESSAGES = {
  MENU_SETUP_TEXT: 'This menu is looking a bit hungry.',
  MENU_SETUP_HEADER_TEXT: 'Menu Setup',
  MENU_DELETE_TEXT:'Residents will no longer be able',
};
export const MenuInfo = {
  MenuName: 'TestingMenu',
  FirstMeal: 'Breakfast',
  SecondMeal: 'Lunch',
  ThirdMeal: 'Dinner',
};
export const EditMenuInfo= {
  RestaurantName:'TestRestaurant',
  MenuName: `Edited menu -${Date.now().toString().slice(-5)}`,
  MenuCycle: '4 Weeks',
  MenuRepeatCycle:'2',
  FirstMeal: 'All Day',
  SecondMeal: 'Brunch',
  ThirdMeal: 'Dinner',
  Audience: ['Resident App', 'Resident Voice']
};
export const RestaurantInfo = {
  RestaurantName: 'TestRestaurant',
  ResidentGroup: ['All Resident Groups'],
};
export const RestaurantInfoWithResidentGroup = {
  RestaurantName: 'TestRestaurant',
  ResidentGroup: ['Independent Living', 'Assisted Living', 'Skilled Nursing']
};
export const EditRestaurantInfo = {
  EditedRestaurantName: `Edited restaurants ${Date.now().toString().slice(-5)}`,
  EditedResidentGroup:['Independent Living', 'Assisted Living'],
};
export const MenuItemsInfo = {
  NewMenuItemName: 'TestItemAppetizar',
  menuItemName: 'TestMenuItemName',
  ItemCategory: 'Appetizer',
  ItemDescription: `Test Item description`,
};
export const EditMenuItemInfo = {
  EditedMenuItemName: `EditedAppetizar ${Date.now().toString().slice(-5)}`,
  EditedItemCategory: 'Other',
};
export const CopyAndPasteMenuItems = {
  CopyFromCell: '0',
  PasteToCell: '4',
  CopyFromMealName: 'Breakfast',
  PasteToMealName: 'Dinner',
};
export const ClearMenuCell = {
  ClearFromCell: '0',
  ClearFromMealName: 'Breakfast',
};
