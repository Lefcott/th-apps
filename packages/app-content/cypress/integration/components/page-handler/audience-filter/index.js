/** @format */

import { Click } from '../../../interactions';
import AudienceFilterElements from '../../page-elements/audience-filter/elements';

export default class AudienceFilter {
  /**
   * Method to filter to different audiences
   */
  static filterTo = () => {
    Click.on(AudienceFilterElements.selector);
    return {
      everyone: () => Click.on(AudienceFilterElements.everyone),
      resident: () => Click.on(AudienceFilterElements.resident),
      family: () => Click.on(AudienceFilterElements.family),
      voice: () => Click.on(AudienceFilterElements.voice),
    };
  };
}
