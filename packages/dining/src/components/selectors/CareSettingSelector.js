/** @format */

import React, { useEffect, useState } from 'react';
import { FormSelect } from '../../utils/formComponents';
import { Typography, Box } from '@material-ui/core';
import { isEmpty } from 'lodash';
import Strings from '../../constants/strings';

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
  name,
  value,
  onChange,
  variant,
  error,
  helperText,
  onBlur,
  disabled,
  careSettingsOptions = [],
  residentGroupsOptions = [],
  residentGroupsEnabled,
  breakWord,
  labelBackgroundColor,
  reference = {},
}) {
  const handleCareSettingChange = (value) => {
    onChange({
      target: {
        name,
        value,
      },
    });
  };

  // Depending on the the feature flag enabled or not
  const totalOptions = residentGroupsEnabled
    ? careSettingsOptions.concat(residentGroupsOptions)
    : careSettingsOptions;

  const [careSettingsValue, setValue] = useState(value);

  useEffect(() => {
    if (
      isEmpty(value) &&
      isEmpty(reference.current) &&
      !Array.isArray(reference.current)
    ) {
      setValue(totalOptions);
    } else {
      setValue(value);
    }
    reference.current = careSettingsValue;
  }, [value]);

  const formattedOptions = totalOptions.map((item) => ({
    id: item._id,
    displayText: getDisplayText(item.name),
    value: !value.length
      ? item
      : value.find((val) => val._id === item._id) || item,
    getChecked(value, option) {
      return !!value.find((careSetting) => careSetting._id === option.id);
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
        name={name}
        variant={variant}
        value={careSettingsValue}
        label={
          residentGroupsEnabled
            ? Strings.Dining.selectors.labels.residentGroups
            : Strings.Dining.selectors.labels.caresettings
        }
        id="AP_careSetting-filter"
        options={formattedOptions}
        valueRenderer={valueRenderer}
        onChange={handleCareSettingChange}
        onBlur={onBlur}
        error={error}
        disabled={disabled}
        helperText={helperText}
        placeholder={
          residentGroupsEnabled
            ? Strings.Dining.selectors.labels.residentGroups
            : Strings.Dining.selectors.labels.caresettings
        }
        selectAllOptionDisplayText={
          residentGroupsEnabled
            ? Strings.Dining.selectors.labels.allResidentGroups
            : Strings.Dining.selectors.labels.allCaresettings
        }
        breakWord={breakWord}
        labelBackgroundColor={labelBackgroundColor}
      />
    </Box>
  );
}
