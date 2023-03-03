/** @format */

import React, { useEffect, useMemo } from 'react';
import { utcToZonedTime, format } from 'date-fns-tz';
import { addMinutes } from 'date-fns';
import { isEqual, uniq, xorWith, includes, get } from 'lodash';
import {
  Card,
  Grid,
  Box,
  FormLabel,
  Typography,
  InputAdornment,
  Tooltip,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { DateTimePicker } from '@material-ui/pickers';
import {
  ErrorOutline,
  CalendarToday,
  Launch as LaunchIcon,
} from '@material-ui/icons';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import {
  FormTextfield,
  CustomTagCreator,
  MultiSelectChip,
} from '../utils/formComponents';
import { getOneSearchParam } from '../utils/url';
import { GET_TAGS } from '../graphql/feed.js';
import { useLazyQuery, useQuery } from '@teamhub/apollo-config';
import { useFlags, useCurrentUser } from '@teamhub/api';
import { formattedAudiences } from '../utils/audiences';
import styled from '@emotion/styled';

import CareSettingSelector from './CareSettingSelector';
import { GET_RESIDENT_GROUPS } from '../graphql/residentGroups';

const DetailsWrapper = styled(Card)`
  &&&& {
    padding: 25px;
    flex: 1;
    display: flex;
    border-radius: 1px;
    background-color: rgba(0, 0, 0, 0.03);
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    border: none;
    box-shadow: none;
    width: 100%;
    box-sizing: border-box;
  }
`;

const SectionTitle = withStyles(() => ({
  root: {
    paddingBottom: '1.5em',
    fontSize: '0.875em',
    color: 'rgba(0, 0, 0, 0.87)',
  },
}))(Typography);

// this checks only the relevant props for this component and rerenders when they change
// if they are deeply equal tho, don't rerender
// used in the React.memo call when exporting the DetailsForm component
const arePropsEqual = (prevProps, nextProps) => {
  const {
    category,
    audiences,
    tags,
    startDate,
    endDate,
    enableNotification,
    residentGroups,
  } = prevProps.data;

  const {
    tagsError,
    tagsHelperText,
    endDateError,
    audiencesError,
    endDateHelperText,
    residentGroupsError,
    residentGroupsHelperText,
    notification,
  } = prevProps;

  const {
    category: nextCategory,
    audiences: nextAudiences,
    tags: nextTags,
    startDate: nextStartDate,
    endDate: nextEndDate,
    enableNotification: nextEnableNotification,
    residentGroups: nextResidentGroups,
  } = nextProps.data;

  const {
    tagsError: nextTagsError,
    tagsHelperText: nextTagsHelperText,
    endDateError: nextEndDateError,
    endDateHelperText: nextEndDateHelperText,
    audiencesError: nextAudiencesError,
    residentGroupsError: nextResidentGroupsError,
    residentGroupsHelperText: nextResidentGroupsHelperText,
    notification: nextNotification,
  } = nextProps;

  const oldProps = {
    category,
    audiences,
    tags,
    startDate,
    endDate,
    tagsError,
    tagsHelperText,
    endDateError,
    endDateHelperText,
    residentGroupsError,
    residentGroupsHelperText,
    enableNotification,
    audiencesError,
    notification,
    residentGroups,
  };

  const newProps = {
    category: nextCategory,
    audiences: nextAudiences,
    tags: nextTags,
    startDate: nextStartDate,
    endDate: nextEndDate,
    tagsError: nextTagsError,
    tagsHelperText: nextTagsHelperText,
    endDateError: nextEndDateError,
    endDateHelperText: nextEndDateHelperText,
    residentGroupsError: nextResidentGroupsError,
    residentGroupsHelperText: nextResidentGroupsHelperText,
    enableNotification: nextEnableNotification,
    audiencesError: nextAudiencesError,
    notification: nextNotification,
    residentGroups: nextResidentGroups,
  };

  if (!isEqual(oldProps, newProps)) {
    return false;
  } else {
    return true;
  }
};

const IndentedLabel = withStyles(() => ({
  root: {
    fontSize: '13px',
    paddingLeft: '1.1em',
  },
}))(FormLabel);

const PushNotificationLabel = ({ startDate, notification = {} }) => {
  const hasNotificationBeenSent =
    notification.sentAt &&
    new Date(notification.sentAt).getTime() < new Date().getTime();
  const isPostInPast = new Date(startDate).getTime() < new Date().getTime();
  const labelText = hasNotificationBeenSent
    ? 'App Push Notification Sent'
    : 'Send App Push Notification';

  let tooltipLabel;

  if (isPostInPast) {
    tooltipLabel =
      'App push notifications can not be sent for posts already published to the app';
  }

  if (hasNotificationBeenSent) {
    tooltipLabel =
      'Residents have already received a push notification for this post';
  }

  const label = (
    <span id="AP_postmodal-enableNotification-label">
      {labelText}
      {hasNotificationBeenSent || isPostInPast ? (
        <Tooltip placement="top-start" title={tooltipLabel}>
          <ErrorOutline
            fontSize="small"
            style={{ verticalAlign: 'text-top', marginLeft: '5px' }}
          />
        </Tooltip>
      ) : null}
    </span>
  );

  return label;
};

function DetailsForm(props) {
  const flags = useFlags();
  const residentGroupsEnabled = flags && flags['teamhub-resident-groupings'];

  const {
    data: feedItemData,
    onChange,
    audiencesError,
    tagsError,
    tagsHelperText,
    endDateError,
    endDateHelperText,
    residentGroupsError,
    residentGroupsHelperText,
    notification,
  } = props;

  const {
    category,
    audiences,
    tags = [],
    startDate,
    endDate,
    enableNotification,
  } = feedItemData;

  const showNotificationCheckbox =
    audiences.includes('Resident') || audiences.includes('Family');
  const communityId = getOneSearchParam('communityId', '2476');

  const [user] = useCurrentUser();
  const timezone = user?.community?.timezone?.name;

  const [
    getTags,
    { data: { community: { tags: tagsOptions = [] } = {} } = {} },
  ] = useLazyQuery(GET_TAGS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const { data: residentGroupsData, loading: residentGroupsLoading } = useQuery(
    GET_RESIDENT_GROUPS,
    {
      variables: { communityId: communityId },
    }
  );

  const sortedTagsOptions = useMemo(() => {
    return [...tagsOptions].sort((a, b) => a.localeCompare(b));
  }, [tagsOptions]);

  const careSettingsGroupsOptions =
    !residentGroupsLoading &&
    get(residentGroupsData, 'community.careSettings', []);

  const residentGroupsOptions =
    !residentGroupsLoading &&
    get(residentGroupsData, 'community.residentGroups.nodes', []);

  const categoriesMap = [
    { name: 'Notice' },
    { name: 'Resource' },
    { name: 'Menu' },
    { name: 'Photo' },
    { name: 'Video' },
    { name: 'Requests', hidden: !flags['request-experience'] },
  ];

  const audiencesMap = Object.values(formattedAudiences);

  //fetch tags
  useEffect(() => {
    getTags({ variables: { communityId, input: { category } } });
  }, [feedItemData]);

  useEffect(() => {
    if (!showNotificationCheckbox) {
      onEnableNotificationChange(null, false);
    }
  }, [showNotificationCheckbox]);

  const onCategoryChange = (event, value) => {
    if (category !== value.name) {
      onChange('category', value.name);
      onChange('tags', []);

      //refetch tags for category
      getTags({
        variables: { communityId, input: { category: value.name } },
      });
    }
  };

  const onStartDateChange = (value) => {
    value = value ? value : new Date();
    onChange('startDate', value);
  };
  const onEndDateChange = (value) => {
    onChange('endDate', value);
  };

  const onAudienceChange = (value) => {
    onChange(
      'audiences',
      value.map((v) => (v.value ? v.value : v))
    );
  };

  const onTagsChange = (event, value) => {
    const mappedValues = value.map((v) =>
      v.inputValue ? v.inputValue.trim() : v.name.trim()
    );

    return onChange('tags', mappedValues);
  };

  const onResidentGroupChange = (values) => {
    return onChange('residentGroups', values);
  };

  const onEnableNotificationChange = (_, value) => {
    onChange('enableNotification', value);
  };

  const disableNotificationChange = () => {
    // if the notification has been sent, disable no matter what
    if (notification && notification.sentAt) {
      return true;
    }
    // if its a new post, keep field active
    if (!feedItemData._id) {
      return false;
    }

    // for post where start date is immediate date will always be in past
    // so lets set a 1 minute buffer.
    const nowish = addMinutes(
      utcToZonedTime(new Date().toISOString(), timezone),
      1
    ).getTime();
    const start = startDate.getTime();
    return Boolean(
      (audiences.length === 1 && audiences[0] === 'ResidentVoice') ||
        start < nowish
    );
  };

  //
  // parse utc strings to tz adjusted dates
  //
  const startDateInputValue =
    startDate.toISOString() <
    addMinutes(
      utcToZonedTime(new Date().toISOString(), timezone),
      1
    ).toISOString()
      ? 'Immediately'
      : format(startDate, 'MMM do, yyyy h:mm aa', { timeZone: timezone });

  const endDateInputValue = endDate
    ? format(endDate, 'MMM do, yyyy h:mm aa', { timeZone: timezone })
    : 'Never';
  return (
    <DetailsWrapper>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box mb={-3}>
            <SectionTitle variant="subtitle1">Folder</SectionTitle>
          </Box>
          {/* Category */}
          <Autocomplete
            id="AP_postmodal-category"
            name="category"
            disableClearable
            options={categoriesMap.filter((c) => !c.hidden)}
            value={{ name: category }}
            onChange={onCategoryChange}
            getOptionLabel={(option) => option.name}
            getOptionSelected={({ name }) => name === category}
            renderInput={(params) => (
              <FormTextfield
                {...params}
                test-dataid="AP_postmodal-category-input"
                label="Category"
                variant="outlined"
              />
            )}
            renderOption={(option) => (
              <span id={`AP_postModal-categoryOptions-${option.name}`}>
                {option.name}
              </span>
            )}
          />

          {/* Tags */}
          <CustomTagCreator
            options={uniq(sortedTagsOptions.concat(tags))}
            values={tags}
            error={!!tagsError}
            noOptionsText={'Start typing to create a new folder'}
            onChange={onTagsChange}
            inputProps={{
              label: 'Folders',
              id: 'AP_postmodal-tags',
              maxLength: 25,
              helperText: tagsHelperText,
            }}
            InputLabelProps={{
              htmlFor: 'AP_postmodal-tags',
            }}
          />

          {/* Schedule */}
          <Box mb={-6}>
            <SectionTitle variant="subtitle1">Scheduling</SectionTitle>
          </Box>
          <Box mt={6}>
            <DateTimePicker
              clearable
              inputVariant="outlined"
              fullWidth
              name="startDate"
              label="Post Start"
              ampm={true}
              id="AP_postmodal-startdate"
              inputProps={{
                'data-value': startDate,
              }}
              value={startDate}
              onChange={onStartDateChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarToday />
                  </InputAdornment>
                ),
              }}
              TextFieldComponent={(params) => (
                <FormTextfield
                  {...params}
                  value={startDateInputValue}
                  variant="outlined"
                />
              )}
            />
          </Box>
          <Box mt={3}>
            <DateTimePicker
              name="endDate"
              clearable
              inputVariant="outlined"
              fullWidth
              ampm={true}
              label="Post End"
              id="AP_postmodal-endate"
              error={endDateError}
              helperText={endDateHelperText}
              value={endDate}
              onChange={onEndDateChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarToday />
                  </InputAdornment>
                ),
              }}
              minDate={startDate}
              TextFieldComponent={(params) => (
                <FormTextfield
                  {...params}
                  value={endDateInputValue}
                  variant="outlined"
                />
              )}
              disablePast
            />
          </Box>

          <Box mt={3}>
            <Box mb={-2}>
              <SectionTitle variant="subtitle1">Audience</SectionTitle>
            </Box>

            {!residentGroupsLoading &&
              (careSettingsGroupsOptions?.length ||
                (residentGroupsEnabled && residentGroupsOptions?.length)) && (
                <CareSettingSelector
                  name="careSettings"
                  value={feedItemData.residentGroups}
                  careSettingsOptions={
                    careSettingsGroupsOptions?.length
                      ? careSettingsGroupsOptions
                      : []
                  }
                  residentGroupsOptions={
                    residentGroupsEnabled && residentGroupsOptions?.length
                      ? residentGroupsOptions
                      : []
                  }
                  onChange={onResidentGroupChange}
                  error={residentGroupsError}
                  helperText={residentGroupsHelperText}
                  variant="outlined"
                  residentGroupsEnabled={residentGroupsEnabled}
                />
              )}
          </Box>

          {/* Audience Select */}
          <Box mt={5}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              {audiencesMap.map((audienceItem) => {
                return (
                  <MultiSelectChip
                    key={audienceItem.value}
                    style={audiencesError ? { backgroundColor: '#FCE7E7' } : {}}
                    item={audienceItem}
                    data-testid={`AP_postmodal-audience-${audienceItem.value}`}
                    selected={includes(audiences, audienceItem.value)}
                    onClick={() => {
                      onAudienceChange(
                        xorWith(audiences, [audienceItem.value], isEqual)
                      );
                    }}
                  />
                );
              })}
            </div>
            <br />
            {audiencesError ? (
              <IndentedLabel component="legend" error={true}>
                {audiencesError}
              </IndentedLabel>
            ) : null}
          </Box>

          {/*Push Notifications*/}
          {showNotificationCheckbox && flags.pushNotifications ? (
            <Box mt={2}>
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="AP_postmodal-enableNotification"
                      name="enableNotification"
                      checked={enableNotification}
                      disabled={disableNotificationChange()}
                      color="primary"
                      onChange={onEnableNotificationChange}
                    />
                  }
                  label={
                    <PushNotificationLabel
                      startDate={feedItemData.startDate}
                      notification={notification}
                    />
                  }
                />
                <br />
                <Box ml={4}>
                  <FormLabel
                    id="AP_postmodal-enableNotification-helpertext"
                    style={{ fontSize: '12px' }}
                  >
                    <Typography display="block" variant="caption">
                      Residents and/or Friends & Family will be notified on
                      their mobile device.
                    </Typography>
                    <Typography
                      style={{ textDecoration: 'none' }}
                      display="block"
                      variant="caption"
                      color="primary"
                      component="a"
                      target="_blank"
                      href="https://support.k4connect.com/knowledgebase/all-about-push-notifications-in-k4community-plus"
                    >
                      View Push Notifications Support Article{' '}
                      <LaunchIcon color="inherit" fontSize="inherit" />
                    </Typography>
                  </FormLabel>
                </Box>
              </div>
            </Box>
          ) : null}
        </Grid>
      </Grid>
    </DetailsWrapper>
  );
}

export default React.memo(DetailsForm, arePropsEqual);
