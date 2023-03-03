/** @format */

import Verify from '../assertions/Verify';
import { Click } from '../interactions';
import { FE, PIP } from '../components';

/**
 * Filter By component namespace
 *
 */
export const FB = {
  Filter: '#mui-component-select-careSettingFilter',
};

/**
 * This abstracts the actions relating to the Filter By
 * @namespace FilterBy
 */
export default class FilterBy {
  /**
   * Method to filter by care setting
   */
  static searchFor = (careSetting) => {
    Click.on(FB.Filter);
    cy.get('body').click();
    Click.on('[data-value="' + careSetting + '"]');
    Click.on(FE.personalInfo);
    var careSettingTrimmed = careSetting.replace('_', ' ');
    Verify.theElement(PIP.careSetting.dropdown).contains(careSettingTrimmed);
    Click.on('#mui-component-select-careSettingFilter > div > svg');
  };
}
