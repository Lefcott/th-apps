/** @format */

import React from 'react';
import { MenuItem, Chip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Cancel as CancelIcon } from '@material-ui/icons';
import { FormDropdown } from '../utils/formComponents';
import { useFilters } from './FilterProvider';
import { useQuery } from '@teamhub/apollo-config';
import { RESIDENT_GROUPS_LIST } from '../graphql/community';
import { getCommunityId, useFlags } from '@teamhub/api';
import { get } from 'lodash';
import getCareSettingsDisplayText from '../utils/getCareSettingsDisplayText';
import strings from '../constants/strings';

const WhiteBackgroundMenuItem = withStyles(() => ({
  selected: {
    backgroundColor: 'white !important',
  },
}))(MenuItem);

const ChipWithMargin = withStyles(() => ({
  root: {
    marginRight: '4px',
  },
}))(Chip);

export default function CareSettingFilter() {
  const [filters, setFilters] = useFilters();
  const value = filters.careSettings;
  const communityId = getCommunityId();

  const { 'teamhub-resident-groupings': residentGroupsEnabled } = useFlags();

  const { data: residentGroupsData, loading: residentGroupsLoading } = useQuery(
    RESIDENT_GROUPS_LIST,
    {
      variables: { communityId },
    },
  );

  const careSettingsList = get(
    residentGroupsData,
    'community.careSettings',
    [],
  );

  const residentGroupsList = residentGroupsEnabled
    ? get(residentGroupsData, 'community.residentGroups.nodes', [])
    : null;

  const noCareSettingOption = {
    name: strings.CareSetting.noCareSetting.name,
    _id: strings.CareSetting.noCareSetting.id,
  };

  // First option is always "No Care Setting"
  const totalOptions = [
    noCareSettingOption,
    ...(residentGroupsEnabled
      ? careSettingsList.concat(residentGroupsList)
      : careSettingsList),
  ];

  const handleChange = React.useCallback((event) => {
    setFilters({ careSettings: event.target.value });
  }, []);

  return (
    <FormDropdown
      name="careSettingFilter"
      inputlabelprops={{
        htmlFor: 'Rm_list_care-setting_filter',
        defaultShrink: false,
      }}
      inputProps={{
        id: 'Rm_filter_care-setting',
      }}
      onChange={handleChange}
      value={value}
      variant="outlined"
      style={{ background: '#fff' }}
      multiple
      label="Filter by"
      MenuProps={{
        variant: 'menu',
        anchorOrigin: {
          horizontal: 'left',
          vertical: 'bottom',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        getContentAnchorEl: null,
        PaperProps: {
          style: {
            maxHeight: 226,
          },
        },
      }}
      renderValue={(selected) => {
        if (selected.length > 0) {
          return selected.map((sel) => {
            return (
              <ChipWithMargin
                size="small"
                label={getCareSettingsDisplayText(sel)}
                deleteIcon={
                  <CancelIcon onMouseDown={(e) => e.stopPropagation()} />
                }
                onDelete={() => {
                  setFilters({
                    careSettings: selected.filter((item) => item !== sel),
                  });
                }}
              />
            );
          });
        } else {
          return '';
        }
      }}
    >
      {totalOptions.map((careSetting) => (
        <WhiteBackgroundMenuItem
          key={careSetting._id}
          value={
            careSetting._id === strings.CareSetting.noCareSetting.id
              ? strings.CareSetting.noCareSetting.id
              : careSetting.name
          }
          divider={
            careSetting._id === strings.CareSetting.noCareSetting.id
              ? true
              : false
          }
        >
          {getCareSettingsDisplayText(careSetting.name)}
        </WhiteBackgroundMenuItem>
      ))}
    </FormDropdown>
  );
}
