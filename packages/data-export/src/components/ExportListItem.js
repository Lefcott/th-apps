import React from 'react';

import { Box, Button, Grid, Typography } from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    '&:not(:first-child)': {
      marginTop: '1rem',
    },
  },
  title: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
  },
  container: {
    border: '1px solid #e5e5e5',
    position: 'relative',
    padding: '20px',
    borderRadius: '4px',
    paddingRight: '1.75rem',
    backgroundColor: '#fff',
  },
}));

export default function ExportListItem({ label, buttonLabel, buttonAction }) {
  const classes = useStyles();

  const action = (evt) => {
    console.log('event', evt);
    console.log('pressing button', action);
    action();
  };

  return (
    <>
      <Grid container className={classes.wrapper}>
        <Grid container item xs={12}></Grid>
        <Box display="flex" className={classes.container} flex={1}>
          <Typography className={classes.title} variant="subtitle1">
            {label}
          </Typography>
          <Button
            color="primary"
            variant="outlined"
            size="small"
            align="right"
            onClick={buttonAction}
          >
            {buttonLabel}
          </Button>
        </Box>
      </Grid>
    </>
  );
}
