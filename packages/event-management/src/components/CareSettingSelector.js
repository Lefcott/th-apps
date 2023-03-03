/** @format */

import React, { useEffect, useState, useRef } from 'react';
import { FormSelect } from '../utils/formComponents';
import { Typography, Box } from '@material-ui/core';
import { isEmpty } from 'lodash';
import strings from '../constants/strings';

function getDisplayText(name) {
  switch (name) {
    case 'Independent':
      return 'Independent Living';
    case 'Assisted':
      return 'Assisted Living';
    case 'Memory Care':
      return 'Memory Care';
    case 'Skilled Nursing':
      return 'Skilled Nursing';
    default:
      return name;
  }
}

export default function CareSettingSelector({
  value,
  onChange,
  variant,
  hasError,
  helperText,
  careSettingsOptions = [],
  residentGroupsOptions = [],
  residentGroupsEnabled,
  breakWord,
  allCareSettingsOption,
}) {
  const [careSettingsValue, setValue] = useState(value);

  const ref = useRef();

  // Depending on the the feature flag enabled or not
  const totalOptions = residentGroupsEnabled
    ? careSettingsOptions.concat(residentGroupsOptions)
    : careSettingsOptions;

  useEffect(() => {
    if (isEmpty(value) && isEmpty(ref.current)) {
      setValue([]);
    } else {
      setValue(value);
    }
    ref.current = careSettingsValue;
  }, [value, careSettingsOptions]);

  const handleCareSettingChange = (value) => {
    onChange(value.filter((x) => x));
  };

  const formattedOptions = totalOptions.map((item) => ({
    id: item._id,
    displayText: getDisplayText(item.name),
    value: !careSettingsValue.length
      ? item
      : careSettingsValue.find((val) => val._id === item._id) || item,
    getChecked(value, option) {
      const isChecked = !!value.find((group) => {
        return group._id === option.id;
      });

      return isChecked;
    },
  }));

  const valueRenderer = (value, i, values) => {
    const displayText = getDisplayText(value.name);
    const text = i === values.length - 1 ? displayText : `${displayText},`;

    return (
      <Typography
        key={value._id}
        display="block"
        variant="body1"
        style={{ marginRight: '0.25rem', display: 'inline-block' }}
      >
        {totalOptions.length ? text : ''}
      </Typography>
    );
  };

  return (
    <Box mt={2}>
      <FormSelect
        multiple
        variant={variant}
        value={careSettingsValue}
        label={
          residentGroupsEnabled
            ? strings.Calendar.residentGroup + 's'
            : strings.Calendar.careSetting + 's'
        }
        id="AP_careSetting-filter"
        options={formattedOptions}
        valueRenderer={valueRenderer}
        onChange={handleCareSettingChange}
        hasError={hasError}
        helperText={helperText}
        placeholder={
          residentGroupsEnabled
            ? strings.Calendar.residentGroup + 's'
            : strings.Calendar.careSetting + 's'
        }
        selectAllOptionDisplayText={
          residentGroupsEnabled
            ? 'All ' + strings.Calendar.residentGroup + 's'
            : 'All ' + strings.Calendar.careSetting + 's'
        }
        residentGroupsEnabled={residentGroupsEnabled}
        breakWord={breakWord}
        labelBackgroundColor="#f9f9f9"
        allCareSettingsOption={allCareSettingsOption}
        styleProps={{ whiteSpace: 'unset', wordBreak: 'break-all' }}
      />
    </Box>
  );
}
