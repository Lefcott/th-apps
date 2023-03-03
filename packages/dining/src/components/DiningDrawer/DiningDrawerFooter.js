/** @format */

import React from 'react';
import { Box } from '@material-ui/core';

export default function DiningDrawerFooter({ children }) {
  return (
    <Box m={2} display="flex" justifyContent="flex-end">
      {children}
    </Box>
  );
}
