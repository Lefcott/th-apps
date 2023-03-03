/** @format */
import React from "react";
import BaseCell, { BaseCellValue } from "./BaseCell";
import { Box, Hidden, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { startCase } from "lodash";
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

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.grey[600],
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(0.5),
  },
}));

export default function AlertCell({ value, globalFilterValue }) {
  const classes = useStyles();
  const { type, room } = value.data;
  return (
    <BaseCell>
      <FontAwesomeIcon size="lg" icon={icons[type]} fixedWidth />
      <Hidden smDown>
        <Box pl={1} display="flex" alignItems="center">
          <BaseCellValue searchWords={globalFilterValue}>
            {startCase(type)}
          </BaseCellValue>

          {type === "Leak" && (
            <Typography classes={classes} variant="body2">
              ({room} Leak Sensor)
            </Typography>
          )}
        </Box>
      </Hidden>
    </BaseCell>
  );
}
