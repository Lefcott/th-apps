/** @format */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
} from '@material-ui/core';
import strings from '../constants/strings';

function CareSettingConfirmationModal({
  details,
  residentGroupsRemoved,
  residentGroupsEnabled,
  open,
  onClose,
  onSave,
}) {
  const classes = useStyles();

  const plural = residentGroupsRemoved.length > 1 ? 's' : '';

  const remainingResidents = [];

  // Map to remove resident that are not in the remaining resident groups
  details.map(({ user, eventName, time }) => {
    const residentGroupFound = user.residentGroups
      .concat(user.careSettingFull)
      .find(
        (residentGroup) => !residentGroupsRemoved.includes(residentGroup.name),
      );

    if (residentGroupFound) {
      remainingResidents.push({
        user: user,
        eventName: eventName,
        time: time,
      });
    }
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {strings.CalendarTable.careSettingsConfirmation.change(
          residentGroupsEnabled
            ? strings.Calendar.residentGroups
            : strings.Calendar.careSettings,
        )}
      </DialogTitle>
      <DialogContent style={{ maxHeight: '450px' }}>
        <DialogContentText style={{ marginBottom: 0 }}>
          {remainingResidents.length > 1
            ? strings.CalendarTable.careSettingsConfirmation.someRemaining(
                remainingResidents?.length,
                residentGroupsEnabled ? 'resident group' : 'care setting',
                plural,
              )
            : strings.CalendarTable.careSettingsConfirmation.oneRemaining(
                remainingResidents?.length,
                residentGroupsEnabled ? 'resident group' : 'care setting',
                plural,
              )}
        </DialogContentText>
        <List className={classes.list}>
          {residentGroupsRemoved.map((residentGroup, index) => (
            <li
              style={{ paddingTop: '6px' }}
              key={`${index} + ${residentGroup}`}
            >
              {residentGroup}
            </li>
          ))}
        </List>
        <DialogContentText>
          {remainingResidents.length > 1
            ? strings.CalendarTable.careSettingsConfirmation
                .theseWillRemainSignedUp
            : strings.CalendarTable.careSettingsConfirmation
                .thisWillRemainSignedUp}
        </DialogContentText>
        <DialogContentText>
          {strings.CalendarTable.careSettingsConfirmation.willNotBeNotified(
            remainingResidents?.length,
          )}
        </DialogContentText>
        {remainingResidents.map(({ user, eventName, time }, index) => (
          <DialogContentText className={classes.line} key={index}>
            {user.firstName} {user.lastName} ({eventName}, {time})
          </DialogContentText>
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          classes={{ root: classes.button }}
          onClick={onClose}
        >
          {strings.Buttons.cancel}
        </Button>
        <Button
          color="primary"
          variant="contained"
          classes={{ root: classes.button }}
          onClick={onSave}
        >
          {strings.Buttons.save}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles((theme) => ({
  list: {
    wordBreak: 'break-all',
    paddingLeft: '40px',
    marginBottom: '8px',
    listStyleType: 'disc',
    color: 'rgba(0, 0, 0, 0.54)',
  },
  button: {
    width: '72px',
    height: '32px',
    marginLeft: theme.spacing(4),
    fontSize: '14px',
    letterSpacing: '1.25px',
  },
}));

export default CareSettingConfirmationModal;
