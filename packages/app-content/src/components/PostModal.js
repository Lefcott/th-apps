/** @format */

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { Dialog, useMediaQuery } from '@material-ui/core';
import { showToast } from '@teamhub/toast';
import { FullPageSpinner } from '../utils/loaders';
import { getCommunityId, useFlags, sendPendoEvent } from '@teamhub/api';
import { useQuery, useMutation } from '@teamhub/apollo-config';
import {
  GET_FEED_ITEM,
  PUBLISH_TO_FEED,
  UPDATE_POST,
  UPDATE_POST_ASSETS,
  UPDATE_NOTIFICATION,
  CREATE_NOTIFICATION,
} from '../graphql/feed.js';
import {
  includes,
  omit,
  upperFirst,
  isArray,
  mapValues,
  isString,
  isEmpty,
  cloneDeep,
} from 'lodash';
import PostForm from './PostForm';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { GET_RESIDENT_GROUPS } from '../graphql/residentGroups';

const useDialogStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(6),
      maxHeight: '90vh',
      width: '60.8125rem',
      maxWidth: '60.8125rem',
    },
  },
}));

function PostModal({ ...props }) {
  const theme = useTheme();
  const history = useHistory();
  const dialogClasses = useDialogStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { 'teamhub-resident-groupings': residentGroupsEnabled } = useFlags();

  const {
    me,
    match: {
      params: { id: feedItemId },
    },
  } = props; // post id

  const communityId = getCommunityId();

  const {
    data: { community: { feedItem, notification } = {} } = {},
    loading,
  } = useQuery(GET_FEED_ITEM, {
    skip: !feedItemId,
    variables: { communityId, feedItemId, resourceId: feedItemId },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const { data: residentGroupsData, loading: residentGroupsLoading } = useQuery(
    GET_RESIDENT_GROUPS,
    {
      variables: { communityId: communityId },
    }
  );

  // Always available (if feature flag for resident group is enabled or disabled)
  const careSettingsList = !residentGroupsLoading
    ? residentGroupsData?.community?.careSettings
    : [];

  // Only available if the feature flag for resident groups is enabled
  const residentGroupsList =
    residentGroupsEnabled && !residentGroupsLoading
      ? residentGroupsData?.community?.residentGroups?.nodes
      : [];

  // residentGroups options list are only careSettings if flag
  // disabled or both careSettings and residentGroups if flag enabled.
  const defaultResidentGroupsOptions = residentGroupsEnabled
    ? careSettingsList.concat(residentGroupsList)
    : careSettingsList;

  const [disabled, setDisabled] = useState(false);

  const mutationComplete = ({ community: { post, publish } }) => {
    setDisabled(false);

    history.push({
      pathname: '/feed',
      search: `?communityId=${communityId}`,
    });

    if (feedItemId) {
      sendPendoEvent('post_mananger_update');
    } else {
      sendPendoEvent('post_mananger_create');
    }

    const { title, category } = publish ? publish : post.edit;
    showToast(`"${title}" posted to ${category}.`);
  };
  //create new -> update cache
  const [writePost] = useMutation(PUBLISH_TO_FEED, {
    onCompleted: mutationComplete,
  });

  //edit existing -> update cache
  const [updatePost] = useMutation(UPDATE_POST, {
    onCompleted: mutationComplete,
  });

  //edit
  const [editAssets] = useMutation(UPDATE_POST_ASSETS);
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
  const [createNotification] = useMutation(CREATE_NOTIFICATION);

  const mapEditAssetInput = (formValues) => {
    let input = {};

    input.assets = getInputAssets(formValues);
    if (formValues.url && formValues.url.length) {
      input.url = formValues.url;
      // ovewrite any present asset urls in case the input url is different
    }
    input.assets = input.assets.filter((item) => item.type !== 'Web');
    return input;
  };

  const getInputAssets = (formValues) =>
    isArray(formValues.assets) ? formValues.assets.map(mapAssetInput) : [];

  const mapAssetInput = (asset) => {
    if (!asset) {
      return;
    }
    const { _id, contentId, name, url, details } = asset;

    const type = includes(['Document'], upperFirst(asset.type))
      ? 'Pdf'
      : upperFirst(asset.type);

    return {
      type,
      contentId: contentId || _id,
      name,
      url,
      details: details || {},
    };
  };

  const transformPostInput = (values) => {
    const newValues = mapValues(values, (v) =>
      isString(v) && isEmpty(v) ? null : v
    );

    // this formats the values to pass only the ids to backend
    newValues.residentGroups = newValues.residentGroups.map((val) => val._id);

    return newValues;
  };

  const mapUpdateNotificationInput = (values) => {
    const { _id, title, body, startDate, enableNotification } = values;

    return {
      resourceId: _id,
      title,
      body,
      startDate,
      delete: !enableNotification,
    };
  };

  const onSubmit = async (values) => {
    setDisabled(true);
    const clonedValues = { ...values };

    if (feedItemId && feedItem?.category !== values.category) {
      sendPendoEvent('post_manager_update_category');
    }

    try {
      // utc those times yo
      clonedValues.startDate = zonedTimeToUtc(
        clonedValues.startDate,
        me?.community?.timezone?.name
      ).toISOString();
      clonedValues.endDate = clonedValues.endDate
        ? zonedTimeToUtc(
            clonedValues.endDate,
            me?.community?.timezone?.name
          ).toISOString()
        : null;

      // if all the resident groups are selected we send and empty array to
      // the backend
      if (
        clonedValues.residentGroups.length ===
        defaultResidentGroupsOptions.length
      ) {
        clonedValues.residentGroups = [];
      }

      // edit post flow
      if (clonedValues._id) {
        const editPostInput = {
          ...omit(clonedValues, [
            '_id',
            '__typename',
            'assets',
            'url',
            'uploadFiles',
          ]),
        };

        const variables = {
          communityId,
          postId: clonedValues._id,
          editPostInput: transformPostInput(editPostInput),
        };

        const editAssetsVariables = {
          communityId,
          postId: clonedValues._id,
          editAssetsInput: mapEditAssetInput(clonedValues),
        };

        if (notification._id) {
          const updateNotificationInput = mapUpdateNotificationInput(
            clonedValues
          );
          updateNotification({
            variables: { communityId, updateNotificationInput },
          });
        }

        // create a notification if it DNE
        else {
          if (clonedValues.enableNotification) {
            const createNotificationInput = {
              resourceId: clonedValues._id,
              title: clonedValues.title,
              body: clonedValues.body,
              startDate: clonedValues.startDate,
              associations: [communityId],
            };
            createNotification({
              variables: { communityId, createNotificationInput },
            });
          }
        }

        editAssets({ variables: editAssetsVariables });

        delete variables.editPostInput.enableNotification;
        updatePost({ variables });
      } else {
        //new post
        const newAssets = getInputAssets(clonedValues);
        const input = {
          ...omit(clonedValues, [
            '_id',
            '__typename',
            'startDate',
            'endDate',
            'assets',
            'uploadFiles',
          ]),
          assets: newAssets,
          schedule: {
            startDate: clonedValues.startDate,
            endDate: clonedValues.endDate,
          },
          enableNotification: clonedValues.enableNotification,
        };

        const variables = {
          communityId,
          input: transformPostInput(input),
        };

        await writePost({
          variables,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDisabled(false);
    }
  };

  const cloneFeedItem = (feedItem, notification) => {
    const timezone = me?.community?.timezone?.name;
    if (isEmpty(feedItem) && isEmpty(notification) && !residentGroupsLoading) {
      return {
        startDate: utcToZonedTime(new Date().toISOString(), timezone),
        category: 'Notice',
        audiences: ['Resident'],
        title: '',
        body: '',
        tags: [],
        enableNotification: false,
        residentGroups: defaultResidentGroupsOptions,
      };
    }

    const clone = {
      ...feedItem,
      // it is important to initialize form schedule values with timezone here
      startDate: utcToZonedTime(feedItem.startDate, timezone),
      endDate: feedItem.endDate
        ? utcToZonedTime(feedItem.endDate, timezone)
        : null,
      residentGroups: isEmpty(feedItem.residentGroups)
        ? defaultResidentGroupsOptions
        : defaultResidentGroupsOptions.filter(({ _id }) =>
            feedItem.residentGroups.includes(_id)
          ),
    };

    if (!isEmpty(notification) && notification._id !== null) {
      clone.enableNotification = !notification?.deleted;
    }

    return cloneDeep(clone);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={true}
      maxWidth={'md'}
      open={true}
      scroll="paper"
      id="AP_postmodal"
      classes={dialogClasses}
      data-testid="AP_postmodal"
    >
      {loading ? (
        <FullPageSpinner />
      ) : (
        !residentGroupsLoading && (
          <PostForm
            me={me}
            // must cloneDeep the feed item, since we can't directly mutate items in the apollo cache
            // this is a problem because we directly modify the feeditem in the post form
            feedItem={cloneFeedItem(feedItem, notification)}
            onSubmit={onSubmit}
            notification={notification}
            communityId={communityId}
            disableSubmit={disabled}
          />
        )
      )}
    </Dialog>
  );
}

export default PostModal;
