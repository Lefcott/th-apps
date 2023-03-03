/** @format */

import React from 'react';
import { Paper, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Logo from '../assets/k4community-logo.svg';
import styles from './Container.module.css';
import Background from '../assets/teamhub-bg.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: `url(${Background})`,
    backgroundRepeat: 'no-repeat',
    width: '100%',
    backgroundSize: 'cover',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  paperArea: {
    marginLeft: '15%',
    padding: '65px 30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 'calc(75% - 15%)',
    maxWidth: '485px',
    height: '500px',
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 60px)',
      marginLeft: '0px',
      flexGrow: 1,
      maxWidth: '100%',
    },
  },
}));

export default function Container(props) {
  const classes = useStyles();

  return (
    <Box
      data-testid="TA_auth-root"
      className={`${classes.root} ${styles['container']}`}
    >
      <Paper className={classes.paperArea}>
        <Box
          component="img"
          src={Logo}
          alt="k4connect-logo"
          margin="0 auto"
          paddingBottom="60px"
          height="90px"
          width="286px"
        />
        {props.children}
      </Paper>
    </Box>
  );
}
