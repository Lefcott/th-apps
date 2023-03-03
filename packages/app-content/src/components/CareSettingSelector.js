/** @format */

import React, { useEffect, useState, useRef } from 'react';
import { FormSelect } from '../utils/formComponents';
import { Typography, Box } from '@material-ui/core';
import { isEmpty } from 'lodash';
import Strings from '../constants/strings';

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
  error,
  helperText,
  careSettingsOptions = [],
  residentGroupsOptions = [],
  residentGroupsEnabled,
}) {
  const handleCareSettingChange = (value) => {
    onChange(value.filter((x) => x));
  };

  // Depending on the the feature flag enabled or not
  const totalOptions = residentGroupsEnabled
    ? careSettingsOptions.concat(residentGroupsOptions)
    : careSettingsOptions;

  const [careSettingsValue, setCareSettingsValue] = useState(value);

  const ref = useRef();

  useEffect(() => {
    if (isEmpty(value) && isEmpty(ref.current)) {
      setCareSettingsValue(totalOptions);
    } else {
      setCareSettingsValue(value);
    }
    ref.current = totalOptions;
  }, [value]);

  const formattedOptions = totalOptions.map((item) => ({
    id: item._id,
    displayText: getDisplayText(item.name),
    value: !careSettingsValue.length
      ? item
      : careSettingsValue.find((val) => val._id === item._id) || item,
    getChecked(value, option) {
      return !!value.find((group) => group._id === option.id);
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
            ? Strings.PostManagerForm.careSettingSelector.labels.residentGroups
            : Strings.PostManagerForm.careSettingSelector.labels.caresettings
        }
        id="AP_careSetting-filter"
        options={formattedOptions}
        valueRenderer={valueRenderer}
        onChange={handleCareSettingChange}
        error={error}
        helperText={helperText}
        placeholder={
          residentGroupsEnabled
            ? Strings.PostManagerForm.careSettingSelector.labels.residentGroups
            : Strings.PostManagerForm.careSettingSelector.labels.caresettings
        }
        selectAllOptionDisplayText={
          residentGroupsEnabled
            ? Strings.PostManagerForm.careSettingSelector.labels
                .allResidentGroups
            : Strings.PostManagerForm.careSettingSelector.labels.allCaresettings
        }
        breakWord
        labelBackgroundColor="#f9f9f9"
      />
    </Box>
  );
}
