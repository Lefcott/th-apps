import React from "react";
import { Box, CircularProgress } from "@material-ui/core";

export default function Loader({ label }) {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress aria-label={label} color="secondary" />
    </Box>
  );
}
