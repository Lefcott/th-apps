/** @format */
import React from 'react';

import {
  Box,
  Select,
  MenuItem,
  IconButton,
  Typography,
} from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRepeatAlt,
  faCalendar,
  faUsers,
  faEdit,
} from '@fortawesome/pro-light-svg-icons';

import { withStyles } from '@material-ui/styles';
import { MenuContext } from '../../contexts/MenuContext';
import { DateTime } from 'luxon';
import { range } from 'lodash';
import { rrulestr } from 'rrule';
import { sendPendoEvent, useCurrentUser } from '@teamhub/api';
import Strings from '../../constants/strings';

const ArrowButton = withStyles({
  root: {
    color: '#000',
    padding: '0.5rem',
  },
})(IconButton);

const EditButton = withStyles((theme) => ({
  root: {
    color: 'rgba(0, 0, 0, 0.8)',
    margin: theme.spacing(0, 0.5),
    fontSize: '14px',
  },
}))(IconButton);

const WeekSelect = withStyles({
  root: {
    border: 'none',
    paddingRight: '1rem',
    paddingLeft: '1rem',
    color: '#000',
    '&::after': {
      content: 'none',
    },
  },
})(Select);

const Label = withStyles({
  root: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: '0.8rem',
    marginTop: '0.2rem',
    marginLeft: '0.2rem',
    textTransform: 'capitalize',
  },
})(Typography);

export default function MenuCalendarToolbar({
  currentWeek,
  setCurrentWeek,
  onMenuDrawerOpen,
}) {
  const [user] = useCurrentUser();
  const communityTimezone =
    user?.community?.timezone?.name || 'America/New_York';
  const { currentMenu } = React.useContext(MenuContext);
  const { availability } = currentMenu;
  const start = DateTime.fromISO(availability.startDate, {
    zone: communityTimezone,
  });
  const end = DateTime.fromISO(availability.endDate, {
    zone: communityTimezone,
  });

  const rule = availability.recurrence
    ? rrulestr(availability.recurrence)
    : null;

  const numOfWeeks = rule?.options?.interval || 1;

  React.useEffect(() => {
    setCurrentWeek(1);
  }, [currentMenu]);

  function getDuration() {
    return Math.floor(end.plus({ minutes: 1 }).diff(start).as('weeks'));
  }

  function handlePreviousWeek() {
    setCurrentWeek(currentWeek - 1);
  }

  function handleNextWeek() {
    setCurrentWeek(currentWeek + 1);
  }

  const audiences = currentMenu.audiences.map((audience) => {
    switch (audience) {
      case 'Resident':
        return 'App';
      case 'ResidentVoice':
        return 'Voice';
      case 'Family':
        return 'Family';
      default:
        return audience;
    }
  });

  const menuCycleDuration = rule?.options?.interval || getDuration();

  return (
    <Box display="flex" mb={1} alignItems="start">
      <Box flex={1}>
        <ArrowButton onClick={handlePreviousWeek} disabled={currentWeek === 1}>
          <ChevronLeft size="small" />
        </ArrowButton>
        <WeekSelect value={currentWeek} disableUnderline>
          {range(1, numOfWeeks + 1).map((weekNum) => (
            <MenuItem
              key={weekNum}
              value={weekNum}
              onClick={() => setCurrentWeek(weekNum)}
            >
              Week {weekNum}
            </MenuItem>
          ))}
        </WeekSelect>
        <ArrowButton
          onClick={handleNextWeek}
          disabled={currentWeek === numOfWeeks}
        >
          <ChevronRight size="small" />
        </ArrowButton>
      </Box>

      <Box>
        <Box display="flex">
          <Box ml={2.75} display="flex" alignItems="center">
            <FontAwesomeIcon icon={faCalendar} />
            <Label>
              {start.toFormat('LLLL dd')}{' '}
              <span style={{ textTransform: 'lowercase' }}>to</span>{' '}
              {end.toFormat('LLLL dd')}{' '}
            </Label>
          </Box>

          <Box ml={2.75} display="flex" alignItems="center">
            <FontAwesomeIcon icon={faRepeatAlt} />
            <Label>{menuCycleDuration} Week Menu Cycle</Label>
          </Box>

          <Box ml={2.75} display="flex" alignItems="center">
            <FontAwesomeIcon icon={faUsers} />
            <Label>{audiences.join(',  ')}</Label>
          </Box>
          <EditButton
            onClick={() => {
              sendPendoEvent(Strings.Dining.pendoEvent.menu.setupOpen);
              onMenuDrawerOpen();
            }}
          >
            <FontAwesomeIcon icon={faEdit} />
          </EditButton>
        </Box>
      </Box>
    </Box>
  );
}
