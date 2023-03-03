/** @format */

import React from 'react';
import strings from '../constants/strings';
import { FormSelect } from '../utils/formComponents';

export const TimeRangeType = {
  MONTH: 'Month',
  WEEK: 'Week',
  DAY: 'Day',
};

export default function DownloadEventsTimeRangeTypeSelector({
  onChange,
  value,
}) {
  const timeRangeOptions = Object.entries(TimeRangeType).map(
    ([key, value]) => ({
      id: key,
      value: value,
      displayText: value,
    }),
  );

  return (
    <FormSelect
      id="EM_timerangetype-filter"
      label={strings.Event.inputs.timeRange}
      value={value}
      options={timeRangeOptions}
      onChange={onChange}
    />
  );
}
