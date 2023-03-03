/** @format */

import React, { useState } from "react";
import AppContainer from "../components/base/BaseAppContainer";
import RCISettings from "./RCISettings";
import BuildingAlerts from "./BuildingAlerts";
import { useFlags } from "@teamhub/api";

export default function SettingsView({ singleSpa }) {
  const flags = useFlags();
  // flags["teamhub-checkin-settings"] = true;

  return (
    <AppContainer>
      <BuildingAlerts mb={3} singleSpa={singleSpa} />
      <RCISettings enabled={flags["teamhub-checkin-settings"]} />
    </AppContainer>
  );
}
