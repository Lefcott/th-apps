/** @format */

import React from 'react';
import backgroundSvg from '../assets/greetings.svg';
import {
  Typography,
  Card,
  CardContent,
  useMediaQuery,
} from '@material-ui/core';
import { DateTime } from 'luxon';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  greetingCard: {
    height: '100%',
    width: '100%',
    background: `url(${backgroundSvg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '4px',
    [theme.breakpoints.down('sm')]: {
      height: '132px',
      overflow: 'visible',
    },
  },
  greetingCardContent: {
    padding: '45px 30px',
    [theme.breakpoints.down('sm')]: {
      height: '132px',
      padding: '20px 14px',
    },
  },
  greetingText: {
    color: 'white',
  },
}));

const TIMER_INTERVAL = 5 * 1000;

export default function Greeting({ user, ...props }) {
  const isMobile = useMediaQuery('(max-width:960px)');
  const [time, setTime] = React.useState(new DateTime.local());
  const classes = useStyles();
  React.useEffect(() => {
    const timerInterval = setInterval(() => {
      const newTime = new DateTime.local();
      if (!time.hasSame(newTime, 'minute')) {
        setTime(new DateTime.local());
      }
    }, [TIMER_INTERVAL]);

    return () => clearInterval(timerInterval);
  });

  return (
    <Card className={classes.greetingCard}>
      <CardContent className={classes.greetingCardContent}>
        <Typography
          className={classes.greetingText}
          variant={isMobile ? 'body2' : 'h5'}
          style={isMobile ? { fontSize: '16px' } : {}}
        >
          Hello {user.firstName}, today is
        </Typography>
        <Typography
          variant={isMobile ? 'h5' : 'h2'}
          className={classes.greetingText}
        >
          {time.toFormat('EEEE, MMM dd')}
        </Typography>
        <Typography
          variant={isMobile ? 'h5' : 'h2'}
          className={classes.greetingText}
        >
          {time.toFormat('t').toLowerCase()}
        </Typography>
      </CardContent>
    </Card>
  );
}
