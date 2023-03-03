/** @format */

import React, { useState, useContext, useEffect } from 'react';
import SlideCarousel from './SlideCarousel';
import { Grid, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { map, isEmpty } from 'lodash';
import VerticalStepper from './VerticalStepper';
import NavBar from './NavBar';
import SchedulePlayDates from './SchedulePlayDates';
import ScheduleRepeat from './ScheduleRepeat';
import RRule from 'rrule';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ScheduleDestinations from './ScheduleDestinations';
import ScheduleDuration from './ScheduleDuration';
import ManagerApi from '../api/managerApi';
import ScheduleSummary from './ScheduleSummary';
import moment from 'moment-timezone';
import { useSnackbar } from 'notistack';
import { useCommunity } from '../contexts/CommunityProvider';
import { useDestinations } from '../contexts/DestinationsProvider';
import { useSchedules } from '../contexts/ScheduleProvider';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    [theme.breakpoints.up('xs')]: {
      overflow: 'hidden',
      height: 'fill-available',
    },
  },
  content: {
    height: '100%',
    flex: 1,
    [theme.breakpoints.up('xs')]: {
      overflow: 'auto',
      height: 'fill-available',
    },
  },
}));

const scheduleSchema = Yup.object().shape({
  destinations: Yup.array().min(1, 'Must select at least one destination'),
  rule: Yup.object({
    dtstart: Yup.date()
      .required()
      .when('until', (until, schema) => {
        if (until) {
          return schema.max(until, 'Start date must be prior to End date');
        }
      }),
    duration: Yup.number()
      .min(0, 'Start time must be prior to End time')
      .required(),
    byweekday: Yup.array().when('freq', {
      is: 2,
      then: Yup.array().required('Must select at least one day'),
    }),
  }),
});

function PublishSchedule() {
  const classes = useStyles();
  const { communityId, timezone } = useCommunity();
  const destinations = useDestinations();
  const [initSchedule, setInitSchedule] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const {
    activeSchedule,
    publishSchedule,
    updateActiveSchedule,
  } = useSchedules();
  const isNewSchedule = activeSchedule.new;

  const newRule = {
    dtstart: moment().startOf('day').toDate(),
    duration: '1440',
    freq: 3,
    timezone, // fix this ish
  };

  useEffect(() => {
    setInitialSchedule();
    // eslint-disable-next-line
  }, [activeSchedule]);

  const setInitialSchedule = () => {
    let rule, destinations, document;
    if (isNewSchedule) {
      rule = newRule;
      destinations = [];
      document = activeSchedule.data;
    } else {
      rule = RRule.fromString(activeSchedule?.data?.rule).origOptions;
      destinations = activeSchedule?.data?.Destinations;
      document = activeSchedule.data;
    }
    setInitSchedule({ rule, destinations, document });
  };

  const submitForm = async (values) => {
    const document = isNewSchedule ? values.document : values.document.Document;
    const contentDate = values.rule.dtstart;
    const newRuleString = new RRule(values.rule).toString();

    const bodyParams = {
      communityId,
      documentId: document.guid,
      order: 1,
      meta: JSON.stringify({ contentDate }),
      destinations: map(values.destinations, 'guid'),
      schedule: newRuleString,
    };

    await publishSchedule(bodyParams, document.name);
  };

  if (!isEmpty(initSchedule)) {
    return (
      <Formik
        initialValues={initSchedule}
        validationSchema={scheduleSchema}
        enableReinitialize
        onSubmit={submitForm}
      >
        {(props) => (
          <Grid container className={classes.container}>
            <Hidden mdUp>
              <NavBar
                title="Edit Schedule"
                onClickAction={() => updateActiveSchedule(null, false)}
              />
            </Hidden>
            <Grid className={classes.content}>
              <Grid item style={{ height: '45%' }} xs={12}>
                <SlideCarousel
                  data={props.values.document}
                  isNewSchedule={isNewSchedule}
                />
              </Grid>
              <Grid item xs={12}>
                <ScheduleSummary {...props} />
              </Grid>
              <Grid item xs={12}>
                <VerticalStepper
                  {...props}
                  steps={[
                    {
                      id: 1,
                      label: 'Where do you want this to play?',
                      body: (
                        <ScheduleDestinations
                          {...props}
                          destOptions={destinations}
                        />
                      ),
                    },
                    {
                      id: 2,
                      label: 'When do you want it to begin and end?',
                      body: <SchedulePlayDates {...props} />,
                    },
                    {
                      id: 3,
                      label: 'What play schedule do you need?',
                      body: <ScheduleDuration {...props} />,
                    },
                    {
                      id: 4,
                      label: 'How do you want it to repeat?',
                      body: <ScheduleRepeat {...props} />,
                    },
                  ]}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Formik>
    );
  }
  return null;
}

export default PublishSchedule;
