/** @format */

import React, { useRef } from 'react';
import { get, pick, isEmpty } from 'lodash';
import { Box, Button, CircularProgress } from '@material-ui/core';
import { FormTextfield } from '../../../utils/formComponents';
import CareSettingSelector from '../../selectors/CareSettingSelector';
import { makeStyles, withStyles } from '@material-ui/styles';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { useMutation, useQuery } from '@teamhub/apollo-config';
import { showToast } from '@teamhub/toast';
import { useFlags, sendPendoEvent, getCommunityId } from '@teamhub/api';

import {
  CREATE_RESTAURANT,
  UPDATE_RESTAURANT,
  REMOVE_RESTAURANT,
} from '../../../graphql/restaurant';
import { GET_RESIDENT_GROUPS } from '../../../graphql/residentGroups';
import { IntegrationsContext } from '../../../contexts/IntegrationsProvider';
import Strings from '../../../constants/strings';

import Delete from './Delete';

const useStyles = makeStyles(() => ({
  root: {
    background: (props) => (props.new ? 'rgba(237, 236, 251, 0.5)' : '#fff'),
  },
  loading: {
    display: 'flex',
    marginTop: '20px',
    justifyContent: 'center',
  },
}));

const PaddedButton = withStyles(() => ({
  root: {
    marginLeft: '1rem',
    padding: '4px 10pxm',
    minWidth: 0,
    fontSize: '10px',
  },
}))(Button);

export default function EditableRestaurantsListItem({
  index,
  names,
  restaurant,
  restaurants,
  setFormState,
  setFormName,
  onClose,
  refetchRestaurants,
  removeNewRestaurantByIndex,
}) {
  const reference = useRef();

  const classes = useStyles({
    new: !restaurant._id,
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(
        3,
        'Restaurant name ' + Strings.Dining.drawer.validation.minCharacters
      )
      .required(Strings.Dining.drawer.validation.nameRequiredError)
      .test(
        'uniqueName',
        'Restaurant ' + Strings.Dining.drawer.validation.nameError,
        function (value) {
          if (!value) {
            return true;
          }
          const { path } = this;

          const exists = Object.entries(names).find(([guid, value]) => {
            guid !== (restaurant._id || restaurant.clientGuid) &&
              typeof formik.values.name === 'string' &&
              typeof value === 'string' &&
              formik.values.name.trim().toLowerCase() ===
                value.trim().toLowerCase();
          });

          if (exists && formik.dirty) {
            if (!restaurant._id) {
              sendPendoEvent(Strings.Dining.pendoEvent.restaurant.editAddError);
            } else {
              sendPendoEvent(
                Strings.Dining.pendoEvent.restaurant.editEditError
              );
            }
            throw this.createError({
              path,
            });
          }

          return true;
        }
      ),
    careSettings: Yup.array()
      .min(0, Strings.Dining.drawer.validation.residentGroupError)
      .of(Yup.object())
      .default([]),
  });

  const communityId = getCommunityId();

  const flags = useFlags();

  const residentGroupsEnabled = flags && flags['teamhub-resident-groupings'];

  const { data: residentGroupsData, loading: residentGroupsLoading } = useQuery(
    GET_RESIDENT_GROUPS,
    {
      variables: { communityId: communityId },
    }
  );

  const careSettingsGroupsOptions = !residentGroupsLoading
    ? get(residentGroupsData, 'community.careSettings', [])
    : [];

  const residentGroupsOptions = !residentGroupsLoading
    ? get(residentGroupsData, 'community.residentGroups.nodes', [])
    : [];

  // Depending on the the feature flag enabled or not
  const totalOptions =
    !residentGroupsLoading && residentGroupsEnabled
      ? careSettingsGroupsOptions.concat(residentGroupsOptions)
      : careSettingsGroupsOptions;

  let careSettings = get(restaurant, 'careSettings');

  if (!residentGroupsLoading && isEmpty(careSettings)) {
    careSettings = totalOptions;
  }

  const initialValues = {
    name: get(restaurant, 'name'),
    // if we are creating a new restaurant by default select all resident groups
    careSettings: restaurant._id ? careSettings : totalOptions,
  };

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
  });

  React.useEffect(() => {
    if (restaurant._id) {
      if (formik.dirty) {
        sendPendoEvent(Strings.Dining.pendoEvent.restaurant.editEdit);
      }
      setFormState(restaurant._id, formik.dirty);
    }
  }, [formik.dirty]);

  React.useEffect(() => {
    setFormName(restaurant._id || restaurant.clientGuid, formik.values.name);
  }, [formik.values.name]);

  React.useEffect(() => {
    setFormName(restaurant._id || restaurant.clientGuid, formik.values.name);
  }, []);

  React.useEffect(() => {
    if (!open) {
      formik.resetForm({
        initialValues,
        values: initialValues,
      });
    }
  });

  const [createRestaurant] = useMutation(CREATE_RESTAURANT, {
    async onCompleted() {
      removeNewRestaurantByIndex(index);
      if (!restaurants.length) {
        sendPendoEvent(Strings.Dining.pendoEvent.restaurant.setupSave);
        onClose();
      }
      await handleCompletedMutation();
    },
    onError(err) {
      if (err.message.match('409')) {
        sendPendoEvent(Strings.Dining.pendoEvent.restaurant.editAddError);
        formik.setFieldError('name', Strings.Restaurant.nameError);
      }
    },
  });
  const [updateRestaurant] = useMutation(UPDATE_RESTAURANT, {
    async onCompleted(data) {
      const update = get(data, 'community.updateRestaurant.restaurant');
      const initialValues = pick(update, 'name', 'careSettings', '_id');
      // clean ref in order to update resident groups selector
      reference.current = undefined;

      formik.resetForm({
        initialValues,
        values: initialValues,
      });

      await handleCompletedMutation();
    },
  });

  const [removeRestaurant, { loading: deleteLoading }] = useMutation(
    REMOVE_RESTAURANT,
    {
      async onCompleted() {
        showToast(Strings.Restaurant.delete);
        await refetchRestaurants();
      },
    }
  );

  async function handleCompletedMutation() {
    showToast(Strings.Restaurant.change);
    await refetchRestaurants();
  }

  async function onSubmit(values) {
    const { name, careSettings } = values;
    let careSettingIds = careSettings.map(({ _id }) => _id);
    // if we have all resident group selected we send an empty array
    // to the backend
    if (careSettings.length === totalOptions.length) {
      careSettingIds = [];
    }

    if (restaurant._id) {
      await updateRestaurant({
        variables: {
          communityId,
          input: {
            name,
            id: restaurant._id,
            residentGroupIds: careSettingIds,
          },
        },
      });
    } else {
      await createRestaurant({
        variables: {
          communityId,
          input: {
            name,
            residentGroupIds: careSettingIds,
          },
        },
      });
    }
  }

  const hasError = (field) =>
    Boolean(formik.errors[field] && formik.touched[field]);
  const fieldErrors = (field) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : '';

  async function handleSubmit(e) {
    if (restaurant._id) {
      sendPendoEvent(Strings.Dining.pendoEvent.restaurant.editSave);
    } else if (restaurants.length) {
      sendPendoEvent(Strings.Dining.pendoEvent.restaurant.addSave);
    }

    formik.handleSubmit(e);
  }

  function handleCancel() {
    if (!restaurant._id) {
      sendPendoEvent(Strings.Dining.pendoEvent.restaurant.addCancel);
      removeNewRestaurantByIndex(index);
    } else {
      sendPendoEvent(Strings.Dining.pendoEvent.restaurant.editCancel);
      formik.resetForm({
        values: formik.initialValues,
      });
    }
  }

  const handleRemove = () => {
    removeRestaurant({
      variables: {
        communityId,
        input: {
          id: restaurant._id,
        },
      },
    });
  };

  const { enabledDiningIntegrations } = React.useContext(IntegrationsContext);

  return (
    <Box
      className={classes.root}
      p={3}
      pt={index ? 3 : 1}
      pb={2}
      flex={1}
      display="flex"
      flexDirection="column"
      borderBottom="1px solid rgba(229, 229, 229, 1)"
    >
      <Box mt={2}>
        <FormTextfield
          id="restaurant_name_field"
          name="name"
          label="Restaurant"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          variant="outlined"
          error={hasError('name')}
          helperText={fieldErrors('name')}
          disabled={!isEmpty(enabledDiningIntegrations)}
        />
      </Box>

      <Box mt={1}>
        {!residentGroupsLoading &&
        (careSettingsGroupsOptions?.length ||
          (residentGroupsEnabled && residentGroupsOptions?.length)) ? (
          <CareSettingSelector
            name="careSettings"
            value={formik.values.careSettings}
            careSettingsOptions={
              careSettingsGroupsOptions?.length ? careSettingsGroupsOptions : []
            }
            residentGroupsOptions={
              residentGroupsEnabled && residentGroupsOptions?.length
                ? residentGroupsOptions
                : []
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={hasError('careSettings')}
            helperText={fieldErrors('careSettings')}
            variant="outlined"
            disabled={!isEmpty(enabledDiningIntegrations)}
            residentGroupsEnabled={residentGroupsEnabled}
            breakWord
            labelBackgroundColor="#ffffff"
            reference={reference}
          />
        ) : (
          <div className={classes.loading}>
            <CircularProgress size={'1.5rem'} />
          </div>
        )}
      </Box>

      <Box
        mt={2}
        mx={0}
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        {restaurant._id && (
          <Delete
            menus={restaurant.menus}
            onRemove={handleRemove}
            isLoading={deleteLoading}
            disabled={!isEmpty(enabledDiningIntegrations)}
          />
        )}

        {(formik.dirty || !restaurant._id) && (
          <Box marginLeft="auto">
            <PaddedButton
              id="AR_restaurant_cancle_Btn"
              onClick={handleCancel}
              size="small"
              variant="text"
            >
              {Strings.Dining.drawer.buttons.cancel}
            </PaddedButton>
            <PaddedButton
              id="AR_restaurant_save_Btn"
              size="small"
              disabled={!formik.isValid || !isEmpty(enabledDiningIntegrations)}
              onClick={handleSubmit}
              variant="contained"
              color="primary"
            >
              {Strings.Dining.drawer.buttons.save}
            </PaddedButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}
