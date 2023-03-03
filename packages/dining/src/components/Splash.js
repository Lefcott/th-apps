/** @format */

import { Box, Button, Typography } from '@material-ui/core';
import React from 'react';

export default function Splash(props) {
  return (
    <Box
      display="flex"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <img id={`${props.action.id}-img`} src={props.image} />
        <Box mt={4} mb={2}>
          <Typography style={{ color: 'rgba(0, 0, 0, .87)' }}>
            {props.text}
          </Typography>
        </Box>

        {props.action && (
          <Button
            id="AM_new-menu-Btn"
            variant="contained"
            color="primary"
            onClick={props.action.onClick}
          >
            {props.action.text}
          </Button>
        )}
      </Box>
    </Box>
  );
}
