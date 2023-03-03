/** @format */

import React from 'react';
import { Box, Drawer, Divider, useMediaQuery, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { ArrowBack, Close as CloseIcon } from '@material-ui/icons';
import clsx from 'clsx';
import strings from '../constants/strings';

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  drawer: (props) => ({
    position: props.isMobile ? 'fixed' : 'relative',
    flexShrink: 0,
    zIndex: 400,
    height: '100%',
  }),
  drawerOpen: (props) => ({
    width: props.isMobile ? '100%' : drawerWidth,
    position: 'relative',
    overflowX: 'auto',
    height: 'fill-available',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  drawerClosed: {
    position: 'relative',
    width: 0,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  backButton: {
    display: 'flex',
    fontSize: '16px',
    justifyContent: 'flex-start',
    padding: '20px',
    width: '100%',
  },
  paper: {
    backgroundColor: '#f0f0f7',
  },
}));

export default function Sidebar(props) {
  const { open, setOpen } = props;
  const isMobile = useMediaQuery('(max-width:960px)');
  const classes = useStyles({ isMobile });
  const history = useHistory();
  const {
    location: { search: searchParams },
  } = history;

  return (
    <Drawer
      id={props.id}
      className={clsx(classes.drawer, {
        [classes.drawerClosed]: !open,
        [classes.drawerOpen]: open,
      })}
      classes={{
        paper: clsx(classes.paper, {
          [classes.drawerOpen]: open,
          [classes.drawerClosed]: !open,
        }),
      }}
      variant="permanent"
    >
      {isMobile ? (
        <>
          <Box
            display="flex"
            justifyContent="flex-end"
            flexShrink="0"
            padding="15px"
          >
            <CloseIcon onClick={() => setOpen(false)} />
          </Box>
          <Divider />
        </>
      ) : (
        <Button
          id="EM_eventDrawer-close"
          className={classes.backButton}
          onClick={() => history.push(`/${searchParams}`)}
        >
          <ArrowBack style={{ marginRight: 5 }} />
          {strings.Settings.backToCalendar}
        </Button>
      )}
      {props.children}
    </Drawer>
  );
}
