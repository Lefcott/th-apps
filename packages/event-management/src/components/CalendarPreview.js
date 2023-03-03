/** @format */

import React, { useRef } from 'react';
import { isEqual, isEmpty, includes, get } from 'lodash';
import { showToast, closeToast } from '@teamhub/toast';
import State from './StateProvider';
import moment from 'moment-timezone';
import { getCommunityId } from '@teamhub/api';
import { PREVIEW_CALENDAR } from '../graphql/events';
import { useMutation } from '@teamhub/apollo-config';
import { ListItem, ListItemText } from '@material-ui/core';
import { Launch as LaunchIcon } from '@material-ui/icons';
import strings from '../constants/strings';

function CalendarPreview() {
  const Context = React.useContext(State);
  const [
    previewCalendarMutation,
    { data: previewUrl, loading: previewLoading },
  ] = useMutation(PREVIEW_CALENDAR);
  const linkRef = useRef();

  const previewCalendar = () => {
    const { date, eventCalendars: calendars, statuses } = get(
      Context,
      'filters',
    );
    if (isEmpty(calendars))
      return showToast(strings.CalendarPreview.selectCalendar, {
        variant: 'error',
      });

    // Do not allow preview when selecting only draft events
    if (statuses.length === 1 && isEqual(statuses[0], 'draft'))
      return showToast(strings.CalendarPreview.draft, { variant: 'error' });

    // Do not allow preview when selecting archived events
    if (includes(statuses, 'archived') || isEmpty(statuses))
      return showToast(strings.CalendarPreview.archived, { variant: 'error' });

    const variables = {
      communityId: getCommunityId(),
      anchoredAt: moment(date),
      calendars: Context.allCalSelected ? [] : calendars,
      types: Context.filters.eventTypes,
      statuses,
    };

    showToast(strings.CalendarPreview.gettingPreviewReady, { persist: true });
    previewCalendarMutation({ variables: variables });
  };

  React.useEffect(() => {
    if (previewUrl) {
      const {
        community: {
          calendars: { previewEventCalendar: url },
        },
      } = previewUrl;
      linkRef.current.href = url;
      linkRef.current.click();
      // calling with no key closes _all_ snackbars
      closeToast();
    }
    // eslint-disable-next-line
  }, [previewUrl]);

  return (
    <ListItem
      id="Em_calendar-preview"
      button
      color="primary"
      onClick={previewCalendar}
      disabled={previewLoading}
      style={{ padding: '8px 24px' }}
    >
      <LaunchIcon
        style={{ marginRight: '8px', fontSize: '1.2rem' }}
        color="primary"
      />
      <ListItemText
        primary={strings.CalendarPreview.previewMonthlyCalendar}
        primaryTypographyProps={{ color: 'primary' }}
      />
      <a target="_blank" ref={linkRef} onClick={(e) => e.stopPropagation()}></a>
    </ListItem>
  );
}

export default CalendarPreview;
