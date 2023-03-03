/** @format */

import React, { useState, useEffect, useMemo } from 'react';
import { get, head, omit, isEmpty } from 'lodash';
import {
  Grid,
  FormControlLabel,
  Switch,
  IconButton,
  Tooltip,
  Typography,
  Button,
} from '@material-ui/core';
import { InfoOutlined, OpenInNew as ExternalLink } from '@material-ui/icons/';
import { Autocomplete } from '@material-ui/lab';
import { FormTextfield } from '../../utils/formComponents';
import EventLinkSelector from '../EventLinkSelector';
import { SchedulingLabel } from '../styleUtils';
import { OpenInNew } from '@material-ui/icons';
import { useFlags, getCommunityId } from '@teamhub/api';
// Scaffold getting signage destinations
import { GET_SIGNAGE_DESTINATIONS } from '../../graphql/destinations';
import { useLazyQuery } from '@teamhub/apollo-config';
import strings from '../../constants/strings';

const videoSrcArr = [
  { name: 'DVD', type: 'DVD', id: 'dvd' },
  { name: 'Link', type: 'Web', id: 'videoLink' },
];

function VirtualEvents(props) {
  const {
    values,
    touched,
    setFieldTouched,
    handleChange,
    setFieldValue,
    errors,
    editRecurring,
    disabled,
  } = props;
  const {
    urlDetails,
    virtualEventDestinations,
    videoSource,
    rule,
    showOnTv,
    isAVirtualEvent,
  } = values;
  const isRepeating =
    (rule && props.isNewEvent) || (!props.isNewEvent && editRecurring && rule);
  const isInitiallyVirtualEvent = useMemo(() => isAVirtualEvent, []);
  const isEditingInitialRepeatingVirtualEvent =
    isInitiallyVirtualEvent && !props.isNewEvent && rule;
  // single destination from list
  const destination = head(virtualEventDestinations);
  /* feature flag
    directBroadcast for insertion video
  */
  const { directBroadcast: hasDirectBroadcastFlag } = useFlags();
  const details = urlDetails;
  const hasError = (field) => touched[field] && errors[field];
  const videoSourceHelperText = (type) => {
    if (hasError('videoSource')) {
      return true;
    }
    if (type === 'DVD') {
      return strings.Event.dvdLabel;
    }
  };
  // Set signage destinations
  const [getSignageDestinations] = useLazyQuery(GET_SIGNAGE_DESTINATIONS, {
    // provide DVD and Video, as we only want those possible signage displays
    variables: {
      communityId: getCommunityId(),
      playableFormats: ['DVD', 'Video'],
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      const d = get(data, 'community.signageDestinations');
      setPossibleDestinations(d);
    },
    onError: (err) => console.error(err),
  });
  useEffect(() => getSignageDestinations(), [getSignageDestinations]);
  const [possibleDestinations, setPossibleDestinations] = useState([{}]);

  const toggleIsVirtualEvent = ({ target: { checked: isVirtual } }) => {
    if (!isVirtual) {
      setFieldValue('isAVirtualEvent', false);
      setFieldValue('url', null);
      setFieldValue('urlDetails', null);
      setFieldValue('virtualEventDestinations', null);
      setFieldValue('videoSource', null);
      setFieldValue('showOnTv', false);
    } else {
      setFieldValue('isAVirtualEvent', true);
    }
  };

  const toggleIsTvEvent = ({ target: { checked: showOnTv } }) => {
    if (!showOnTv) {
      setFieldValue('urlDetails', omit({ ...details }, 'videoSourceDetails'));
      setFieldValue('virtualEventDestinations', null);
      setFieldValue('videoSource', null);
      setFieldValue('showOnTv', false);
    } else {
      setFieldValue('showOnTv', true);
    }
  };

  const setVirtualDestinations = (val) => {
    const playableFormats = get(val, 'playableFormats', []);
    const dest = {
      _id: get(val, '_id'),
      name: get(val, 'name'),
      playableFormats,
    };

    // we cleared out the field so clear out the other relevant pieces
    if (!val) {
      setFieldValue('virtualEventDestinations', null);
      setFieldValue('videoSource', null);
      setFieldValue('urlDetails', null);
      setFieldValue('url', null);
    } else {
      // check to see if we need to ALSO null the video source and url details
      if (!isEmpty(values.videoSource)) {
        const mappedFormats = playableFormats.map(({ name }) =>
          name === 'Video' ? 'Web' : name,
        );
        if (!mappedFormats.includes(values.videoSource.type)) {
          setFieldValue('videoSource', null);
          setFieldValue('urlDetails', null);
          setFieldValue('url', null);
        }
      }
      setFieldValue('virtualEventDestinations', [dest]);
    }
  };

  const updateVideoSource = (videoSourceDetails) => {
    const type = get(videoSourceDetails, 'type');
    if (type === 'DVD') {
      setFieldValue('url', null);
      setFieldValue('urlDetails', { videoSourceDetails });
    } else {
      setFieldValue('urlDetails', { ...details, videoSourceDetails });
    }
    setFieldValue('videoSource', videoSourceDetails);
  };

  const onLinkChange = async (event) => {
    if (!touched.url) {
      setFieldTouched('url');
    }
    // this is the raw event from the input
    handleChange(event);
  };
  const onPreviewChange = (previewData) =>
    setFieldValue('urlDetails', { ...details, ...previewData });

  const isVideoSourceDisabled = isEmpty(destination);
  let destinationSources;
  if (destination) {
    destinationSources = destination.playableFormats.map(({ name }) =>
      name === 'Video' ? 'Web' : name,
    );
  }
  const validVideoSources = videoSrcArr.filter((videoSrcObj) => {
    if (destinationSources) {
      return destinationSources.includes(videoSrcObj.type);
    }
    // return everything if we don't have destination sources
    return true;
  });
  // we display the urlField in two cases:
  // virtual event is toggled and showOnTv is false (not scheduled for a tv display)
  // they have toggled the show on tv, and have selected a Web based video source
  const isUrlFieldDisplayed =
    (isAVirtualEvent && !showOnTv) ||
    (showOnTv && get(videoSource, 'type') === 'Web');
  return (
    <Grid
      container
      spacing={3}
      style={{ padding: '0 25px' }}
      id="EM_virtualEvents"
    >
      {/* toggles */}
      <Grid item xs={12}>
        <Grid item xs={12}>
          <FormControlLabel
            id="EM_virtualEvents-toggles-virtualEvent"
            style={{ marginRight: '3px' }}
            disabled={disabled || isEditingInitialRepeatingVirtualEvent}
            control={
              <Switch
                checked={isAVirtualEvent}
                id="EM_virtualEvents-toggles-virtualEvent-switch"
                color="primary"
                onChange={(val) => toggleIsVirtualEvent(val)}
              />
            }
            label={strings.Event.virtual}
          />
          <Tooltip title={strings.Event.virtualEventTooltip} placement="top">
            <IconButton
              disableRipple
              style={{
                cursor: 'default',
                fontSize: '12px',
                marginBottom: '3px',
              }}
            >
              <InfoOutlined />
            </IconButton>
          </Tooltip>
        </Grid>
        {hasDirectBroadcastFlag && isAVirtualEvent ? (
          <Grid item xs={12} style={{ padding: '5px 0' }}>
            <FormControlLabel
              id="EM_virtualEvents-toggles-showOnTv"
              style={{ marginRight: '3px' }}
              disabled={disabled || isEditingInitialRepeatingVirtualEvent}
              control={
                <Switch
                  checked={showOnTv}
                  id="EM_virtualEvents-toggles-showOnTv-switch"
                  color="primary"
                  onChange={(val) => toggleIsTvEvent(val)}
                />
              }
              label={strings.Event.showOnTV}
            />
            <Tooltip title={strings.Event.showOnTVTooltip} placement="top">
              <IconButton
                disableRipple
                style={{
                  cursor: 'default',
                  padding: 0,
                  marginBottom: '3px',
                  display: isRepeating ? 'inline-flex' : 'none',
                }}
              >
                <InfoOutlined />
              </IconButton>
            </Tooltip>
          </Grid>
        ) : null}
        {isAVirtualEvent && (
          <Grid
            item
            xs={12}
            style={{ whiteSpace: 'pre-line', marginTop: '1em' }}
          >
            <SchedulingLabel>
              {strings.Event.communityLabel}
              <Typography
                id="EM_learnHowToUpgradeLink"
                style={{
                  paddingLeft: '5px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                color="primary"
                component="a"
                href="https://launch.k4connect.com/product/upgrade-to-k4community-plus-or-direct-broadcast/"
                target="_blank"
              >
                {`${strings.Event.communityUpgrade} `}
                <ExternalLink
                  style={{ fontSize: '14px', paddingLeft: '3px' }}
                />
              </Typography>
            </SchedulingLabel>
          </Grid>
        )}
      </Grid>

      {/* destinations dropdown */}
      {showOnTv ? (
        <Grid item xs={12}>
          <Grid item xs={6}>
            <Autocomplete
              id="EM_virtualEvents-destinations"
              options={possibleDestinations}
              getOptionSelected={(opt, value) => opt._id === get(value, '_id')}
              getOptionLabel={(opt) => get(opt, 'name', '')}
              value={destination}
              onChange={(e, dest) => setVirtualDestinations(dest)}
              disabled={disabled || isEditingInitialRepeatingVirtualEvent}
              renderInput={(params) => (
                <FormTextfield
                  {...params}
                  required
                  error={hasError('virtualEventDestinations')}
                  name="virtualEventDestinations"
                  label={strings.Event.inputs.tvChannel}
                  helperText={hasError('virtualEventDestinations')}
                  data-testid="EI_virtual-event-destination-text-field"
                />
              )}
            />
          </Grid>
        </Grid>
      ) : null}

      {/* video source dropdown */}
      {showOnTv ? (
        <Grid item xs={12}>
          <Grid item xs={6}>
            <Autocomplete
              id="EM_virtualEvents-videoSrc"
              options={validVideoSources}
              getOptionSelected={(opt, value) => opt.id === get(value, 'id')}
              getOptionLabel={(opt) => get(opt, 'name', '')}
              value={videoSource}
              disabled={
                isVideoSourceDisabled ||
                disabled ||
                isEditingInitialRepeatingVirtualEvent
              }
              onChange={(e, src) => updateVideoSource(src)}
              renderOption={(option) => (
                <Typography id={`EM_virtualEvents-videoSrc-${option.id}`}>
                  {option.name}
                </Typography>
              )}
              renderInput={(params) => (
                <FormTextfield
                  {...params}
                  required
                  error={hasError('videoSource')}
                  name="videoSource"
                  label={strings.Event.inputs.videoSource}
                  disabled={
                    isVideoSourceDisabled ||
                    disabled ||
                    isEditingInitialRepeatingVirtualEvent
                  }
                  FormHelperTextProps={{ style: { marginLeft: 0 } }}
                  helperText={videoSourceHelperText(get(videoSource, 'type'))}
                  data-testid="EI_virtual-event-video-src-text-field"
                />
              )}
            />
          </Grid>
        </Grid>
      ) : null}

      {isUrlFieldDisplayed && showOnTv && (
        <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 0 }}>
          <SchedulingLabel style={{ paddingTop: 0, paddingBottom: 0 }}>
            {strings.Event.learnMore}
            <Button
              variant="text"
              id={'EM_virtualEvents-videoSrcHelper-supportArticle-videoLink'}
              color="primary"
              target="_blank"
              href={
                'https://support.k4connect.com/knowledgebase/video-and-dvd-scheduling-faqs/'
              }
              disabled={disabled}
              style={{
                left: '3px',
                textTransform: 'none',
              }}
            >
              {strings.Event.directBreadcastSupport}
              <OpenInNew fontSize="small" style={{ marginLeft: '0.6em' }} />
            </Button>
          </SchedulingLabel>
        </Grid>
      )}

      {/* video url */}
      {isUrlFieldDisplayed ? (
        <Grid item xs={12}>
          <EventLinkSelector
            values={values}
            url={values.url}
            urlDetails={values.urlDetails}
            videoSource={values.videoSource}
            error={hasError('url')}
            onLinkChange={onLinkChange}
            onPreviewChange={onPreviewChange}
            disabled={disabled || isEditingInitialRepeatingVirtualEvent}
          />
        </Grid>
      ) : null}
    </Grid>
  );
}

export default VirtualEvents;
