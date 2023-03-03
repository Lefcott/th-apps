/** @format */

import React, { useContext, useState } from 'react';
import State from '../StateProvider';
import RRule from 'rrule';
import { elementScrollIntoViewPolyfill } from 'seamless-scroll-polyfill';
import {
  get,
  set,
  omit,
  includes,
  map,
  pickBy,
  isUndefined,
  isEmpty,
  clone,
  remove,
  isEqual,
  intersectionBy,
} from 'lodash';
import { useHistory } from 'react-router-dom';
import { showToast, showErrorToast } from '@teamhub/toast';
import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { sendPendoEvent } from '@teamhub/api';
import setInitialData from './setInitialEventData';
import { FormContainer, ScrollableDiv, Wrapper } from '../styleUtils';
import { Formik } from 'formik';
import Schedule from './Schedule';
import MoreInfo from './MoreInfo';
import BasicInfo from './BasicInfo';
import VirtualEvent from './VirtualEvents';
import WidgetOptions from './WidgetOptions';
import EventHeader from './EventHeader';
import EventDeletion from '../EventDeletion';
import RemoveRsvpDialog from '../RmRsvpDialog';
import { FormErrorListener } from '../../utils/formComponents';
import { getOneSearchParam } from '../../utils/url';
import {
  generateStartDate,
  generateSignupsEndDateTime,
} from '../../utils/helpers';
import eventSchema from './validationSchema';
import { useQuery, useMutation } from '@teamhub/apollo-config';
import { GET_FILTERS, CREATE_EVENT, UPDATE_EVENT } from '../../graphql/events';
import { setNthDate } from './ruleUtils';
import moment from 'moment-timezone';
import strings from '../../constants/strings';
import { getFieldErrorNames } from '../../utils/helpers';

const useStyles = makeStyles((theme) => ({
  divider: {
    width: '200%',
    margin: '40px 0',
    position: 'relative',
    left: '-50%',
  },
  containerBlock: {
    maxWidth: '750px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
}));

function determineScope(editRecurring, isRecurring) {
  if (editRecurring && isRecurring) {
    // editing events forward of a recurring instance
    return 'forward';
  } else if (!editRecurring && isRecurring) {
    // creating a breakout event that does not recur
    return 'single';
  } else if (!editRecurring && !isRecurring) {
    // this case is an event that does not recur
    return 'all';
  }
}

function EventInfo(props) {
  const { isNewEvent, disabled, event, isSubmitting } = props;
  const [addAnother, setAddAnother] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogVariables, setDialogVariables] = useState(null);
  const Context = useContext(State);
  const history = useHistory();
  const {
    location: { search: searchParams },
  } = history;
  const communityId = getOneSearchParam('communityId', '14').replace(/\D/g, '');
  const initialStartDate = moment(history.location.state?.startDate);
  const { eventCalendars } = Context.filters;

  const source = history.location.state?.source;
  const [createEvent] = useMutation(CREATE_EVENT, { ignoreResults: true });
  const [updateEvent] = useMutation(UPDATE_EVENT, { ignoreResults: true });
  const classes = useStyles();
  const { data } = useQuery(GET_FILTERS, {
    variables: { communityId },
  });

  /**
   * retreives calendar list from context filters. If existing event,
   * returns events calendars.
   */
  function getFilterCalendars() {
    if (!event) {
      const calendarsArr = clone(data.community.eventCalendars);
      remove(calendarsArr, (cal) => isEqual(cal.name, 'Unassigned'));
      const resolvedCals = eventCalendars.map((calId) => {
        return calendarsArr.find((cal) => cal._id === calId);
      });
      if (resolvedCals.length <= calendarsArr.length) {
        return { calendars: resolvedCals };
      }
      return {};
    }
    return event.calendars;
  }

  function formatEvent(event) {
    const { rule, calendars, url } = event;

    if (rule) {
      if (rule.byweekday && event.nthDates.length > 0) {
        rule.byweekday = setNthDate(event.nthDates, rule.byweekday);
      }
      const newRuleString = new RRule(rule).toString();
      set(event, 'rule', newRuleString);
    }
    set(event, 'calendars', map(calendars, '_id'));

    if (event.virtualEventDestinations) {
      set(event, 'virtualEventInsertion', {
        signageDisplays: event.virtualEventDestinations
          ? map(event.virtualEventDestinations, '_id')
          : null,
        videoSource: event.virtualEventDestinations
          ? get(event, 'videoSource.type')
          : null,
      });
    } else {
      set(event, 'virtualEventInsertion', null);
    }

    // If url is an empty string it is replaced by null which is accepted by the backend
    if (!url) {
      set(event, 'url', null);
    }

    // here we want to avoid sending back certain props and form specific fields
    return pickBy(
      omit(event, [
        '_id',
        'virtualEventDestinations',
        'videoSource',
        'nthDates',
        'showOnTv',
        'isAVirtualEvent',
        'recurrence',
        'openSpots',
        'totalSpots',
        'startsAt',
        'nthDates',
        'startTime',
        'endTime',
        'recurring',
        'numSignups',
        'virtualEventDestinations',
        'videoSource',
        'showOnTv',
        'recurrence',
        'isAVirtualEvent',
        'signupsEndTime',
        'signupsEndDate',
      ]),
      (val) => !isUndefined(val),
    );
  }

  const submitForm = (values, actions) => {
    // This logic gets called if validation schema passes
    let valueCopy = Object.assign(
      {},
      {
        ...values,
        startDate: generateStartDate(values.startDate, values.startTime),
        signupsEnd: generateSignupsEndDateTime(
          values.signupsEndDate,
          values.signupsEndTime,
        ),
      },
    );
    isNewEvent
      ? createNewEvent(valueCopy, actions.resetForm, actions)
      : editEvent(valueCopy, actions.resetForm, actions);
  };

  const createNewEvent = (values, reset, actions) => {
    const rrule = values.rule;
    const event = formatEvent(values);
    const calendars = intersectionBy(
      data.community.eventCalendars,
      map(values.calendars, (_id) => ({ _id })),
      '_id',
    );

    createEvent({ variables: { communityId, event } })
      .then(() => {
        if (source === 'dayColumn') {
          sendPendoEvent('event_create_new_column_save');
        }
        if (event.status === 'Draft') {
          sendPendoEvent('event_save_draft');
        } else {
          sendPendoEvent('event_publish');
        }

        showToast(strings.Event.createSuccess(event.name), {
          classes: 'EI-snackbar-success snackbar-create',
        });

        if (addAnother) {
          reset({
            values: {
              ...values,
              rule: rrule,
              name: '',
              description: '',
              calendars,
            },
          });
        } else {
          reset();
          history.push(`/${searchParams}`);
        }
      })
      .catch((err) => {
        actions.setSubmitting(false);
        console.warn(err);
        showErrorToast();
      });
  };

  const editEvent = (event, reset, actions) => {
    const { name } = event;

    event = formatEvent(event);

    const variables = {
      force: false,
      communityId,
      updates: event,
      eventId: props.event.eventId,
      scope: determineScope(Context.editRecurring, props.event.recurring),
      date: props.event.startsAt,
    };
    updateEvent({
      variables,
    })
      .then(() => {
        if (event.status === 'Draft') {
          sendPendoEvent('event_save_draft');
        } else {
          sendPendoEvent('event_publish');
        }
        reset();
        successOnSave(name);
      })
      .catch((err) => errorOnSave(err, variables))
      .finally(() => actions.setSubmitting(false));
  };

  const successOnSave = (name) => {
    showToast(strings.Event.editSuccess(name), {
      classes: 'EI-snackbar-success snackbar-edit',
    });
    history.push(`/${searchParams}`);
  };

  const errorOnSave = (err, variables) => {
    const hasSignups = includes(err.message, '405');
    if (hasSignups) {
      // at this point we want to convert force to true
      // to allow for overriding the signups blocker
      setDialogVariables({ ...variables, force: true });
      setIsDialogOpen(true);
    } else {
      showErrorToast();
      console.warn(err);
    }
  };

  React.useEffect(() => elementScrollIntoViewPolyfill(), []);

  const handleErrorOnSubmit = React.useCallback((errors) => {
    const errorNames = getFieldErrorNames(errors);
    if (isEmpty(errorNames)) return;

    const errorName = errorNames[0];
    const errorToElementNames = {
      duration: 'endTime',
      'rule.fred': 'repeatFrequency',
      'rule.interval': 'repeatInterval',
      'rule.byweekday': 'byweekday',
    };

    const elementName = errorToElementNames[errorName] || errorName;
    const element = document.querySelector(`[name='${elementName}']`);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        inline: 'end',
        block: 'center',
      });
      element.focus({ preventScroll: true });
    }
  }, []);

  if (data) {
    const initialCalendars = getFilterCalendars();

    return (
      <Formik
        initialValues={setInitialData({
          isNew: isNewEvent,
          event,
          startDate: initialStartDate,
          initialCalendars: initialCalendars,
        })}
        validationSchema={eventSchema}
        onSubmit={submitForm}
      >
        {(props) => (
          <Wrapper>
            <FormErrorListener onError={handleErrorOnSubmit} />
            <EventHeader
              {...props}
              isSubmitting={isSubmitting}
              handleSubmit={props.handleSubmit}
              disabled={disabled}
              isNewEvent={isNewEvent}
              setAddAnother={setAddAnother}
              addAnother={addAnother}
              event={event}
              scope={determineScope(Context.editRecurring, event?.recurring)}
            />

            <Divider />

            <ScrollableDiv
              style={{
                overflowX: 'hidden',
                paddingTop: '40px',
                paddingBottom: '32px',
              }}
            >
              <FormContainer container>
                <BasicInfo
                  {...props}
                  disabled={disabled}
                  filters={data.community}
                />
                <Divider className={classes.divider} />
                <VirtualEvent
                  {...props}
                  validateThis={eventSchema}
                  filters={data.community}
                  editRecurring={Context.editRecurring}
                  isNewEvent={isNewEvent}
                  disabled={disabled}
                />
                <Divider className={classes.divider} />
                <Schedule
                  {...props}
                  editRecurring={Context.editRecurring}
                  filters={data.community}
                  disabled={disabled}
                />
                <Divider className={classes.divider} />
                <MoreInfo
                  {...props}
                  eventTypes={data.community.eventTypes}
                  isNewEvent={isNewEvent}
                  disabled={disabled}
                />
                <Divider className={classes.divider} />
                <WidgetOptions {...props} disabled={disabled} />
                {!isNewEvent && (
                  <EventDeletion
                    isRecurring={Context.editRecurring}
                    event={event}
                  />
                )}
              </FormContainer>
            </ScrollableDiv>

            <RemoveRsvpDialog
              isOpen={isDialogOpen}
              onClose={() => {
                setIsDialogOpen(false);
                setDialogVariables(null);
              }}
              event={event}
              isRecurring={Context.editRecurring}
              variables={dialogVariables}
              onSuccess={successOnSave}
            />
          </Wrapper>
        )}
      </Formik>
    );
  }
  return null;
}

export default EventInfo;
