/** @format */

import { Click, Type } from "../interactions";
import { Verify } from "../assertions";

/**
 * Attendance Signups component namespace
 * @namespace
 */

export const AS = {
  buildingAlerts: {
    toggle: "",
    notificationsToggle: "",
    addPhoneNumberBtn: "",
    addPhoneNumberInput: "",
  },
};

export default class AlertSettings {
  /**
   * Method to Add a user to an event
   */
  static toggleNotifications = () => {
    Click.on(AS.buildingAlerts.toggle);
  };

  static addNotificationNumber = (number) => {
    Type.theText(number).into(AS.buildingAlerts.addPhoneNumberInput);
  };
}
