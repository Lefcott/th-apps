/** @format */

import { Click } from '../../interactions';
import StaffListItems from '../page-elements/staff-list-items';

/**
 * This abstracts the actions relating to a Feed Item
 * @namespace StaffListItem
 */
export default class StaffListItem {
  /**
   * Method to edit a staff member given a name
   */
  static editItemNamed = (name) => {
    Click.on(StaffListItems.moreMenu.selector);
    Click.on(StaffListItems.moreMenu.edit);
  };
}
