/** @format */
import React from "react";
import BaseCell, { BaseCellValue } from "./BaseCell";
import { Box, Hidden } from "@material-ui/core";
import { DateTime } from "luxon";
import { startCase } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTint,
  faFire,
  faTemperatureFrigid,
  faTemperatureHot,
} from "@fortawesome/pro-regular-svg-icons";

export default function TimeCell({ value, globalFilterValue }) {
  const mobileDate = DateTime.fromISO(value).toFormat("LLL d, t");
  const desktopDate = DateTime.fromISO(value).toFormat("cccc, LLLL d 'at' t");
  return (
    <BaseCell>
      <Hidden smDown>
        <Box pl={1}>
          <BaseCellValue searchWords={globalFilterValue}>
            {desktopDate}
          </BaseCellValue>
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Box pl={1}>
          <BaseCellValue searchWords={globalFilterValue}>
            {mobileDate}
          </BaseCellValue>
        </Box>
      </Hidden>
    </BaseCell>
  );
}
