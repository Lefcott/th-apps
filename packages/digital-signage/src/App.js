/** @format */

import React from 'react';
import { useSchedules } from './contexts/ScheduleProvider';
import ListActions from './components/ListActions';
import List from './components/List';
import Welcome from './components/Welcome';
import PublishSchedule from './components/PublishSchedule';
import SignageDialog from './components/SignageDialog';
import { useMediaQuery } from '@material-ui/core';
import { isNull } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  app: {
    height: 'fill-available',
    display: 'flex',
    flexFlow: 'column',
    [theme.breakpoints.only('xs')]: {
      margin: 0,
      width: 'fill-available',
    },
  },
  container: {
    height: 'fill-available',
    overflow: 'hidden',
    display: 'flex',
    flexFlow: 'row',
    boxShadow: '0 0 8px 0 regba(0, 0, 0, 0.16)',
  },
  listContainer: {
    height: 'fill-available',
    display: 'flex',
    flexFlow: 'column',
    backgroundColor: '#e5e5e5',
    flex: 1,
    borderRight: '1px solid #cccccc',
  },
  welcome: {
    height: 'fill-available',
    flex: 1,
    backgroundColor: '#e5e5e5',
    display: 'flex',
    flexDirection: 'column',
  },
}));

function App(props) {
  const isMobile = useMediaQuery('(max-width:960px)');
  const classes = useStyles();
  const { activeSchedule } = useSchedules();

  return (
    <div className={classes.app}>
      <SignageDialog />

      <div className={classes.container}>
        {(!isMobile || (isMobile && isNull(activeSchedule.data))) && (
          <div className={classes.listContainer}>
            <ListActions />
            <List />
          </div>
        )}
        {(!isMobile || (isMobile && !isNull(activeSchedule.data))) && (
          <div className={classes.welcome}>
            {isNull(activeSchedule.data) ? <Welcome /> : <PublishSchedule />}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
