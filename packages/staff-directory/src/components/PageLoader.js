/** @format */

import React from 'react';
import { Box } from '@material-ui/core';
import BaseLoader from './base/BaseLoader';

export default function PageLoader({ size = 'lg' }) {
  return (
    <Box
      top={0}
      left={0}
      width={1}
      height={1}
      position="absolute"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <BaseLoader size={size} />
    </Box>
  );
}
