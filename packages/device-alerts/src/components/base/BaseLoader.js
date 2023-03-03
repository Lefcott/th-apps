/** @format */

import React from "react";
import { CircularProgress } from "@material-ui/core";

const LoaderSize = {
  sm: 24,
  md: 40,
  lg: 60,
};

export default function BaseLoader({ size = "sm", ...props }) {
  const loaderSize = LoaderSize[size];

  return <CircularProgress size={loaderSize} color="primary" {...props} />;
}
