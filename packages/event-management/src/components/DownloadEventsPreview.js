/** @format */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import strings from '../constants/strings';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: 'rgba(239, 239, 239, 0.51)',
    height: '100%',
    color: 'rgba(0, 0, 0, 0.55)',
    fontFamily: 'Roboto',
  },
}));

const useTextStyles = makeStyles((theme) => ({
  title: {
    fontSize: theme.spacing(2),
    color: 'rgba(0, 0, 0, 0.37)',
  },
  date: {
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.60)',
    marginRight: theme.spacing(0.5),
  },
  subtitle: {
    marginRight: theme.spacing(0.5),
  },
  description: {
    whiteSpace: 'no',
  },
}));

export default function DownloadEventsPreview({ fieldOptions = {} }) {
  const classes = useStyles();
  const textClasses = useTextStyles();

  const { dayOfWeek, description, endTime, location, period } = fieldOptions;
  const getTitle = () => strings.Download.preview.title;
  const getDayOfWeek = () => strings.Download.preview.dayOfWeek;
  const getDate = () => strings.Download.preview.date;
  const getStartTime = () => strings.Download.preview.startTime(period);
  const getEndTime = () => strings.Download.preview.endTime(period);
  const getEventName = () => strings.Download.preview.eventName;
  const getLocation = () => strings.Download.preview.location;
  const getDescription = () => strings.Download.preview.description;

  return (
    <Box
      p={2.25}
      classes={classes}
      id="EM_eventpreview"
      data-testid="EM_eventpreview"
    >
      <Typography
        variant="subtitle1"
        className={textClasses.title}
        id="EM_eventpreview-title"
        data-testid="EM_eventpreview-title"
      >
        {getTitle()}
      </Typography>

      <Box mt={0.5}>
        {dayOfWeek && (
          <Typography
            variant="h6"
            display="inline"
            className={textClasses.date}
            id="EM_eventpreview-dayofweek"
            data-testid="EM_eventpreview-dayofweek"
          >
            {getDayOfWeek()}
          </Typography>
        )}
        <Typography
          variant="h6"
          display="inline"
          id="EM_eventpreview-date"
          data-testid="EM_eventpreview-date"
          className={textClasses.date}
        >
          {getDate()}
        </Typography>
      </Box>

      <Box mt={1.5}>
        <Typography
          display="inline"
          id="EM_eventpreview-starttime"
          data-testid="EM_eventpreview-starttime"
          classes={{ root: !endTime && textClasses.subtitle }}
        >
          {getStartTime()}
        </Typography>
        {endTime && (
          <Typography
            display="inline"
            id="EM_eventpreview-endtime"
            data-testid="EM_eventpreview-endtime"
            classes={{ root: textClasses.subtitle }}
          >
            {getEndTime()}
          </Typography>
        )}
        <Typography
          display="inline"
          id="EM_eventpreview-name"
          data-testid="EM_eventpreview-name"
          classes={{ root: textClasses.subtitle }}
        >
          {getEventName()}
        </Typography>
        {location && (
          <Typography
            display="inline"
            id="EM_eventpreview-location"
            data-testid="EM_eventpreview-location"
            classes={{ root: textClasses.subtitle }}
          >
            {getLocation()}
          </Typography>
        )}
      </Box>
      {description && (
        <Box mt={1} whiteSpace="break-spaces">
          <Typography
            id="EM_eventpreview-description"
            data-testid="EM_eventpreview-description"
          >
            {getDescription()}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
