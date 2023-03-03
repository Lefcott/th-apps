/** @format */
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@material-ui/core';
import { DateTime } from 'luxon';
import { makeStyles } from '@material-ui/core/styles';
import { useFlags } from '@teamhub/api';
import { showErrorToast, showToast, closeToast } from '@teamhub/toast';
import ChipHeader from './ChipHeader';
import Icon from './Icon';
import MailService from '../services/mailService';

const mailService = new MailService();

const useStyles = makeStyles((theme) => ({
  mail: {
    maxHeight: '273px',
    width: '100%',
    [theme.breakpoints.only('xs')]: {
      overflow: 'visible',
    },
  },
  actionArea: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '16px',
  },
}));

export default function MailNotifier({ user, ...props }) {
  const [mailArrivalTime, setMailArrivalTime] = React.useState(null);
  const { mailIsHere } = useFlags();
  const announceMail = async (forceUndo) => {
    const undo = Boolean(mailArrivalTime) || forceUndo;
    let arrivalTime = new DateTime.local();
    // if we have a mailarrivaltime, we're undoing
    if (undo) {
      setMailArrivalTime(null);
      arrivalTime = arrivalTime.minus({ days: 1 });
    }

    const res = await mailService.announceMailIsHere(
      user.community._id,
      new Date(arrivalTime).toISOString(),
    );
    if (res === 201) {
      if (!undo) {
        setMailArrivalTime(arrivalTime);
        showToast('Mail notification has been sent.', {
          action: (key) => (
            <Button
              style={{ color: 'white' }}
              onClick={() => {
                // we call announcemail again to undo
                announceMail(true);
                closeToast(key);
              }}
            >
              Undo
            </Button>
          ),
        });
      }
    } else {
      showErrorToast();
    }
  };

  // onLoad check to see if we should enable the mail announcement
  React.useEffect(() => {
    (async () => {
      const mailInfo = await mailService.fetchMailInfo(user.community._id);
      if (mailInfo) {
        const today = new DateTime.local();
        const arrivalDate = new DateTime.fromISO(
          mailInfo.lastMailArrivedTime,
        ).setZone(user.community.timezone.name);

        //  if they have not announced the mail today
        // enable the mail announcement button
        if (today.day === arrivalDate.day) {
          setMailArrivalTime(arrivalDate);
        }
      }
    })();
  }, [user.community._id, user.community.timezone.name]);
  const classes = useStyles();

  let mailText;
  if (mailArrivalTime) {
    mailText = `Mail arrived at ${mailArrivalTime.toFormat('t')}`;
  } else {
    mailText = 'Is the mail here?';
  }

  return (
    <Card hidden={!mailIsHere} className={classes.mail}>
      <CardContent style={{ paddingBottom: '0px' }}>
        <ChipHeader
          label="Mail"
          icon={<Icon className="far fa-envelope"></Icon>}
        />
      </CardContent>
      <CardActions className={classes.actionArea}>
        <Typography variant="body1">{mailText}</Typography>
        <Button
          id={
            mailArrivalTime
              ? 'LP_undoMail_button'
              : 'LP_mailAnnouncement_button'
          }
          variant="contained"
          color="primary"
          onClick={() => announceMail()}
        >
          {mailArrivalTime ? 'Undo' : 'Notify Residents'}
        </Button>
      </CardActions>
    </Card>
  );
}
