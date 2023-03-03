/** @format */

import React from 'react';
import { get } from 'lodash';
import { SwipeableItem } from '@k4connect/caregiver-components';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import { Phone as PhoneIcon } from '@material-ui/icons';
import { formatPhone } from './PrintAttendance';
import OverlayLoading from './OverlayLoading';
import deleteIcon from '../assets/delete-24px.svg';
import addIcon from '../assets/done-24px.svg';
import defaultIcon from '../assets/default.svg';
import strings from '../constants/strings';

const BASE_STYLE = {
  background: 'black',
  color: 'white',
  fontSize: '11px',
  width: '90px',
  fontWeight: 'bold',
};

const ADD = [
  {
    name: 'Present',
    alias: 'Present',
    position: 'right',
    icon: addIcon,
    style: { ...BASE_STYLE, background: '#00838c' },
    badgeStyle: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
];

const REMOVE = [
  {
    name: 'Remove',
    alias: 'Remove',
    position: 'left',
    icon: deleteIcon,
    style: { ...BASE_STYLE, background: '#a20202' },
    badgeStyle: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
];

export default function AttendanceListItem(props) {
  const { user, submit, listType } = props;
  const [loading, setLoading] = React.useState(false);
  let thumbnail = get(user, 'user.thumbnail');
  if (
    thumbnail === 'https://k4connect-shared.s3.amazonaws.com/misc/profile.svg'
  ) {
    thumbnail = null;
  }
  const buttons = listType === 'signups' ? ADD : REMOVE;
  async function handleClick() {
    setLoading(true);
    await submit(user);
    setLoading(false);
  }

  const phone = get(user, 'user.primaryPhone', get(user, 'displayPhone'));

  return (
    <SwipeableItem buttons={buttons} onClick={handleClick}>
      <ListItem divider button style={{ position: 'relative' }}>
        {loading && <OverlayLoading />}
        <ListItemAvatar style={{ marginRight: '8px' }}>
          <Avatar
            alt={user.displayName}
            src={thumbnail || defaultIcon}
            style={{ height: '62px', width: '62px' }}
          />
        </ListItemAvatar>
        <ListItemText primary={user.displayName} />
        <ListItemSecondaryAction>
          {phone && (
            // right now we are assuming US area code
            <IconButton href={`tel:1-${formatPhone(phone)}`}>
              <PhoneIcon />
            </IconButton>
          )}
        </ListItemSecondaryAction>
      </ListItem>
    </SwipeableItem>
  );
}

export function InfoListItem({ listType }) {
  let text;
  if (listType === 'signups') {
    text = strings.Attendance.markAsPresent;
  } else {
    text = strings.Attendance.remove;
  }
  return (
    <ListItem style={{ backgroundColor: '#f0f0f8', padding: '12px' }}>
      <ListItemText secondary={text} />
    </ListItem>
  );
}
