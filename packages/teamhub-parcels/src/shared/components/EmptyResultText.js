import React from "react";
import { Box, Typography } from "@material-ui/core";

export default function EmptyResultText({ message }) {
  return (
    <Box px={1} py={4}>
      <Typography variant="body1">{message}</Typography>
    </Box>
  );
}
