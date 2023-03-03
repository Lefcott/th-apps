/** @format */

import { Click } from '../../../interactions';
import LogOutPageElements from '../../page-elements/logout-page/elements';
/**
 * This abstracts the actions relating to the LogOutPage
 * @namespace LogOutPage
 */
export default class LogoutComponent {
  /**
   * Method to logout
   */
  static logout = () => {
    Click.on(LogOutPageElements.logout.dropDownBtn);
    Click.on(LogOutPageElements.logout.logOutBtn);
  };
}
