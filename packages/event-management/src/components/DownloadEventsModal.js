/** @format */

import React, { useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItem,
  ListItemText,
  Button,
  Grid,
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DownloadIcon from '../assets/download-icon.svg';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { useQuery, useApolloClient } from '@teamhub/apollo-config';
import {
  GET_CALENDARS,
  GET_EVENTS_FOR_DOWNLOAD,
  GET_LOCATIONS,
} from '../graphql/events';
import { get } from 'lodash';
import { getOneSearchParam } from '../utils/url';
import TimeRangeTypeSelector, {
  TimeRangeType,
} from './DownloadEventsTimeRangeTypeSelector';
import TimeRangeSelector, {
  TimeRange,
  getDateForTimeRange,
} from './DownloadEventsTimeRangeSelector';
import CalendarSelector from './DownloadEventsCalendarSelector';
import { DateTime } from 'luxon';
import OptionsSelector from './DownloadEventsOptionsSelector';
import DownloadEventsPreview from './DownloadEventsPreview';
import FormGroup from './FormGroup';
import State from './StateProvider';
import strings from '../constants/strings';

window.DateTime = DateTime;
export const FilenameFormatByTimeRangeType = {
  [TimeRangeType.MONTH]: 'MMM-yyyy',
  [TimeRangeType.WEEK]: 'MMM-d-yyyy',
  [TimeRangeType.DAY]: 'MMM-d-yyyy',
};

const useStyles = makeStyles((theme) => ({
  download: {
    color: theme.palette.primary.main,
    height: '1.2rem',
    width: '1.2rem',
    marginRight: '8px',
  },

  input: {
    '&::placeholder': {
      color: 'black',
    },
  },
}));

const useDialogStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      margin: 0,
    },
  },
}));

const useDialogContentStyles = makeStyles(() => ({
  root: {
    overflowY: 'visible',
  },
}));

const useDialogActionsStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

const useDownloadButtonStyles = makeStyles((theme) => ({
  root: {
    marginRight: theme.spacing(2),
  },
  disabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.37) !important',
  },
  text: {
    color: '#fff',
  },
}));

const useCircularProgressStyles = makeStyles((theme) => ({
  root: {
    marginRight: theme.spacing(1),
  },
  colorPrimary: {
    color: '#fff',
  },
}));

export default function DownloadEventsModal() {
  const client = useApolloClient();
  const Context = useContext(State);
  const isMobile = useMediaQuery('(max-width:960px)');

  // dialog open/close management
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  // fields to include or exclude
  const [fieldOptions, setFieldOptions] = React.useState({
    dayOfWeek: true,
    period: true, // am to the pm
    endTime: true,
    description: true,
    location: true,
  });

  const [filter, setFilter] = React.useState({
    timeRange: TimeRange.THIS_MONTH,
    timeRangeType: TimeRangeType.MONTH,
    calendars: [],
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const onFilterChange = (name) => (value) => {
    setFilter((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleClose = () => setIsDialogOpen(false);
  const handleOpen = () => setIsDialogOpen(true);
  const communityId = getOneSearchParam('communityId', '2476');
  const { data: calendarData } = useQuery(GET_CALENDARS, {
    variables: { communityId },
    skip: !isDialogOpen,
  });
  // pull calendar options out of the returned data
  const calendars = get(calendarData, 'community.eventCalendars', []);

  const getCalendars = () => {
    return filter.calendars.map((cal) => cal._id);
  };

  const getAnchorDate = () => {
    return getDateForTimeRange(filter.timeRange, Context.timezone);
  };

  const fetchLocations = async () => {
    const { data } = await client.query({
      query: GET_LOCATIONS,
      variables: {
        communityId,
      },
    });

    return data.community.eventLocations.reduce((locationMap, event) => {
      locationMap.set(event.name, event);
      return locationMap;
    }, new Map());
  };

  const fetchEvents = async () => {
    const { data } = await client.query({
      query: GET_EVENTS_FOR_DOWNLOAD,
      variables: {
        communityId,
        limit: 1000,
        includePast: true,
        onlyPublished: false,
        timeframe: filter.timeRangeType,
        calendars: getCalendars(),
        anchoredAt: getAnchorDate(),
      },
    });

    return data.community.events;
  };

  const generateEventDoc = async (events, locationMap) => {
    let eventDoc = new Document();
    let eventFormattedDoc = events.map((event, idx, eventArr) => {
      const { name, description, location, allDay, startsAt, endsAt } = event;

      const startDate = DateTime.fromISO(startsAt, { zone: Context.timezone });
      const endDate = DateTime.fromISO(endsAt, { zone: Context.timezone });
      let formattedStart, formattedEnd;
      // AM PM formatting.
      if (fieldOptions.period) {
        formattedStart = startDate.toFormat('h:mma');
        formattedEnd = fieldOptions.endTime
          ? '-' + endDate.toFormat('h:mma')
          : '';
      } else {
        formattedStart = startDate.toFormat('h:mm');
        formattedEnd = fieldOptions.endTime
          ? '-' + endDate.toFormat('h:mm')
          : '';
      }

      // determing if an event is all day to return that instead of a time that DNE
      const formattedEventTime = allDay
        ? strings.Event.allDay
        : `${formattedStart}${formattedEnd}`;
      const formattedLocation =
        fieldOptions.location && location && locationMap.get(location)
          ? `(${locationMap.get(location).abbr})`
          : '';

      // Array where formated event text runs are getting added to.
      let formattedParagraph = [];

      // I do not like this bit of logic - I wasnt able to get a section list to play nicely with doc formatting and children.
      // Day of week, month day
      let formattedSectionDate = fieldOptions.dayOfWeek
        ? startDate.toFormat("EEEE',' MMMM d")
        : startDate.toFormat('MMMM d');

      let slicedDate = startsAt.slice(0, 10); // return only the date part of ISO string for comparison. ex. 1792-12-31
      // Add the date here if first in array
      if (idx === 0) {
        formattedParagraph.push(
          new TextRun({ text: formattedSectionDate, bold: true }).break(),
          new TextRun({ text: '' }).break(),
        );
      }
      // if not the first,  check if prev date includes current sliced date if not add a section header.
      if (idx > 0 ? !eventArr[idx - 1].startsAt.includes(slicedDate) : false) {
        formattedParagraph.push(
          new TextRun({ text: '' }).break(),
          new TextRun({ text: formattedSectionDate, bold: true }).break(),
          new TextRun({ text: '' }).break(),
        );
      }

      formattedParagraph.push(
        new TextRun({
          text: `${formattedEventTime} ${name} ${formattedLocation}`,
        }).break(),
      );

      // nothing fancy just add description is requested
      if (fieldOptions.description && description) {
        formattedParagraph.push(new TextRun({ text: description }).break());
      }

      return new Paragraph({
        children: formattedParagraph,
      });
    });

    eventDoc.addSection({ children: eventFormattedDoc });

    const mimeType =
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    const blob = await Packer.toBlob(eventDoc);
    const docBlob = blob.slice(0, blob.size, mimeType);
    return docBlob;
  };

  const getExportFileName = () => {
    const FILE_EXT = 'docx';
    let filename =
      filter.timeRangeType === TimeRangeType.WEEK ? 'Week of ' : '';
    filename += getDateForTimeRange(
      filter.timeRange,
      Context.timezone,
    ).toFormat(FilenameFormatByTimeRangeType[filter.timeRangeType]);
    return `${filename}.${FILE_EXT}`;
  };

  const handleEventsExport = async (evt) => {
    evt.preventDefault();
    setIsLoading(true);
    try {
      const locationMap = fieldOptions.location
        ? await fetchLocations()
        : new Map();
      const events = await fetchEvents();
      let doc = await generateEventDoc(events, locationMap);
      // Name by selected filters
      await saveAs(doc, getExportFileName());
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  const classes = useStyles();
  const dialogClasses = useDialogStyles();
  const dialogContentClasses = useDialogContentStyles();
  const dialogActionsClasses = useDialogActionsStyles();
  const downloadButtonClasses = useDownloadButtonStyles();
  const circularProgressClasses = useCircularProgressStyles();

  return (
    <>
      <ListItem
        data-testid="EM_download-to-word-list-item"
        id="EM_download-to-word-list-item"
        style={{ padding: '8px 24px' }}
        button
        onClick={handleOpen}
      >
        <img
          className={classes.download}
          src={DownloadIcon}
          style={{ fill: '#4c43db' }}
          alt="download icon"
        />
        <ListItemText
          color="primary"
          primary={strings.Event.download.downloadEventListToWord}
          primaryTypographyProps={{ color: 'primary' }}
        />
      </ListItem>
      <Dialog
        classes={dialogClasses}
        data-testid="EM_download-events-modal"
        open={isDialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {strings.Event.download.downloadEventListToWord}
        </DialogTitle>
        <DialogContent classes={dialogContentClasses}>
          <Grid container spacing={isMobile ? 1 : 3}>
            <Grid item xs={12} md={4}>
              <Box>
                <TimeRangeTypeSelector
                  value={filter.timeRangeType}
                  onChange={onFilterChange('timeRangeType')}
                />
              </Box>

              <Box mt={3.3}>
                <TimeRangeSelector
                  value={filter.timeRange}
                  onChange={onFilterChange('timeRange')}
                  timeRangeType={filter.timeRangeType}
                />
              </Box>

              <Box mt={3.3}>
                <CalendarSelector
                  options={calendars}
                  value={filter.calendars}
                  onChange={onFilterChange('calendars')}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              {/* preview stuff will go in this item */}
              <FormGroup label={strings.Event.inputs.options}>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <Box px={2} py={1}>
                      <OptionsSelector
                        fieldOptions={fieldOptions}
                        setFieldOptions={setFieldOptions}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <DownloadEventsPreview fieldOptions={fieldOptions} />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions classes={dialogActionsClasses}>
          <Button id="EM_download-events-cancel" onClick={handleClose}>
            {strings.Buttons.cancel}
          </Button>
          <Button
            disabled={isLoading}
            variant="contained"
            color="primary"
            onClick={handleEventsExport}
            classes={downloadButtonClasses}
            id="EM_download-events-button"
            data-testid="EM_download-events-button"
          >
            {isLoading ? (
              <>
                <CircularProgress
                  size={20}
                  thickness={4}
                  classes={circularProgressClasses}
                  color="primary"
                />
                <Typography classes={{ root: downloadButtonClasses.text }}>
                  {strings.Calendar.downloading}
                </Typography>
              </>
            ) : (
              strings.Calendar.download
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
