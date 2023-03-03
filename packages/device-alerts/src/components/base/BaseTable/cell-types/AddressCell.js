/** @format */
import React from "react";
import BaseCell, { BaseCellValue } from "./BaseCell";
import { Box, Hidden } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTint,
  faFire,
  faTemperatureFrigid,
  faTemperatureHot,
} from "@fortawesome/pro-regular-svg-icons";

let icons = {
  LowTemp: faTemperatureFrigid,
  HighTemp: faTemperatureHot,
  Leak: faTint,
  OvenOn: faFire,
};

export default function AddressCell({ value, globalFilterValue }) {
  return (
    <BaseCell>
      {/* <FontAwesomeIcon size="lg" icon={icons[value]} /> do we need info about the residence in an icon? */}
      <BaseCellValue>{value.data.address}</BaseCellValue>
    </BaseCell>
  );
}
