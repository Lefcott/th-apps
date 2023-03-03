/** @format */

import { Click, Type } from "../interactions";
import { Verify } from "../assertions";

/**
 * Attendance Signups component namespace
 * @namespace
 */

export const BA = {
  searchbar: "#SD-toolbar-searchbar",
  buildingAlertsSettingsBtn: "#SD_table-settingsBtn",
};

export default class BuildingAlerts {
  static searchFor = (name) => {
    Type.theText(name).into(BA.searchbar);
  };

  static goToSettings = () => {
    Click.on(BA.buildingAlertsSettingsBtn);
    Verify.theUrl.includes("settings");
  };
}
