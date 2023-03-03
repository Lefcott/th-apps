/** @format */

import { Click } from '../../../interactions';
import ViewFilterElements from '../../page-elements/view-filter/elements';

export default class ViewFilter {
  /**
   * Method to filter to different views
   */
  static filterTo = () => {
    // Click.on(ViewFilterElements.selector);
    return {
      upcoming: () => Click.on(ViewFilterElements.upcoming),
      active: () => Click.on(ViewFilterElements.active),
      ended: () => Click.on(ViewFilterElements.ended),
    };
  };
}
