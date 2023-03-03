/** @format */

import React from 'react';
import { Box, Typography } from '@material-ui/core';

import SearchBar from './SearchBar';

export default function SearchHeader({ text, ...otherProps }) {
  return (
    <Box display="flex" flexDirection="column" width={1} my={-1.25}>
      <Box mb={2}>
        <Typography> {text} </Typography>
      </Box>
      <SearchBar {...otherProps} />
    </Box>
  );
}
