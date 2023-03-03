/** @format */

import React, { useEffect, useContext } from 'react';
import { FormSelect } from '../utils/formComponents';
import { DateTime } from 'luxon';
import { TimeRangeType } from './DownloadEventsTimeRangeTypeSelector';
import State from './StateProvider';
import strings from '../constants/strings';

export const TimeRange = {
  THIS_MONTH: 'This Month',
  NEXT_MONTH: 'Next Month',
  TWO_MONTHS_FROM_NOW: 'Two Months From Now',
  THIS_WEEK: 'This Week',
  NEXT_WEEK: 'Next Week',
  TODAY: 'Today',
  TOMORROW: 'Tomorrow',
};

export const getDateForTimeRange = (timeRange, timezone) => {
  let today = DateTime.local().setZone(timezone);

  switch (timeRange) {
    case TimeRange.THIS_MONTH:
      return today.startOf('month');
    case TimeRange.NEXT_MONTH:
      return today.plus({ months: 1 }).startOf('month');
    case TimeRange.TWO_MONTHS_FROM_NOW:
      return today.plus({ months: 2 }).startOf('month');
    case TimeRange.THIS_WEEK:
      return floorToLocalWeek(today);
    case TimeRange.NEXT_WEEK:
      return floorToLocalWeek(today.plus({ weeks: 1 }));
    case TimeRange.TODAY:
      return today.startOf('day');
    case TimeRange.TOMORROW:
      return today.plus({ days: 1 }).startOf('day');
    default:
      return today;
  }
};

export function floorToLocalWeek(date) {
  const fd = 7;
  const day = date.weekday % 7; // convert to 0=sunday .. 6=saturday
  const dayAdjust = day >= fd ? -day + fd : -day + fd - 7;
  return date.plus({ days: dayAdjust });
}

export function ceilToLocalWeek(date) {
  const ld = 6;
  const day = date.weekday % 7; // convert to 0=sunday .. 6=saturday
  const dayAdjust = ld - day;
  return date.plus({ days: dayAdjust });
}

export default function DownloadEventsTimeRangeSelector({
  timeRangeType,
  onChange,
  value,
}) {
  const Context = useContext(State);
  useEffect(() => {
    const timeRange = getTimeRange(timeRangeType, Context.timezone);
    const defaultValue = timeRange.options[0].value;
    onChange(defaultValue);
    // eslint-disable-next-line
  }, [Context.timezone, timeRangeType]);

  const timeRange = getTimeRange(timeRangeType, Context.timezone);
  const valueRenderer = (timeRange) => {
    switch (timeRange) {
      case TimeRange.THIS_MONTH:
      case TimeRange.NEXT_MONTH:
      case TimeRange.TWO_MONTHS_FROM_NOW:
        return getDateForTimeRange(timeRange, Context.timezone).monthLong;
      default:
        return timeRange;
    }
  };
  return (
    <FormSelect
      id="EM_timerange-filter"
      label={timeRange.label}
      value={value}
      valueRenderer={valueRenderer}
      options={timeRange.options}
      onChange={onChange}
    />
  );
}

const getTimeRange = (timeRangeType, timezone) => {
  switch (timeRangeType) {
    case TimeRangeType.MONTH:
      return {
        label: strings.Event.inputs.month,
        options: getMonthOptions(timezone),
      };

    case TimeRangeType.WEEK:
      return {
        label: strings.Event.inputs.week,
        options: [
          {
            id: TimeRange.THIS_WEEK,
            value: TimeRange.THIS_WEEK,
            displayText: TimeRange.THIS_WEEK,
          },
          {
            id: TimeRange.NEXT_WEEK,
            value: TimeRange.NEXT_WEEK,
            displayText: TimeRange.NEXT_WEEK,
          },
        ],
      };
    case TimeRangeType.DAY:
      return {
        label: strings.Event.inputs.day,
        options: [
          {
            id: TimeRange.TODAY,
            value: TimeRange.TODAY,
            displayText: TimeRange.TODAY,
          },
          {
            id: TimeRange.TOMORROW,
            value: TimeRange.TOMORROW,
            displayText: TimeRange.TOMORROW,
          },
        ],
      };
    default:
      return {};
  }
};

const getMonthOptions = (timezone) => {
  const monthOptions = [
    TimeRange.THIS_MONTH,
    TimeRange.NEXT_MONTH,
    TimeRange.TWO_MONTHS_FROM_NOW,
  ].map((timeRange) => {
    const date = getDateForTimeRange(timeRange, timezone);

    return {
      id: timeRange,
      value: timeRange,
      displayText: date.monthLong,
    };
  });

  return monthOptions;
};
