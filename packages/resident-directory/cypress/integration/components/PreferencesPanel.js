/** @format */

import { Click } from '../interactions';

/**
 * Preferences panel component namespace
 *
 */
export const PP = {
  panel: '#Rm_Panel-preferences',
  checkinAlertsToggle: 'input[name="checkin"]',
};

/**
 * This abstracts the actions relating to the PreferencesPanel
 * @namespace PreferencesPanel
 */
export default class PreferencesPanel {
  /**
   * Method to open the PreferencesPanel
   */
  static open = () => Click.on(PP.panel);

  /**
   * Method to toggle the checkin alerts
   */
  static toggle = () => Click.on(PP.checkinAlertsToggle);
}
