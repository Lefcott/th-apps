/** @format */

import { useFormik } from 'formik';
import React from 'react';
import { get, isEmpty, isEqual, cloneDeep } from 'lodash';
import * as Yup from 'yup';

import { Box, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/styles';
import { DateTime } from 'luxon';

import DiningDrawer, {
  DiningDrawerCloseConfirmation,
  DiningDrawerFooter,
  DiningDrawerFooterAction,
} from '../DiningDrawer';
import { RestaurantContext } from '../../contexts/RestaurantContext';
import { IntegrationsContext } from '../../contexts/IntegrationsProvider';
import { FormTextfield } from '../../utils/formComponents';
import RepeatMenuCycleSelector from '../selectors/RepeatMenuCycleSelector';
import RestaurantSelector from '../selectors/RestaurantSelector';
import MealSelector from '../selectors/MealSelector';
import StartDateSelector from '../selectors/StartDateSelector';
import AvailabilitySelector from '../selectors/AvailabilitySelector';
import AudienceSelector from '../selectors/AudienceSelector';

import { CREATE_MENU, UPDATE_MENU } from '../../graphql/menu';

import { showToast } from '@teamhub/toast';
import { useMutation } from '@teamhub/apollo-config';
import { getCommunityId, sendPendoEvent, useCurrentUser } from '@teamhub/api';
import { MenuContext } from '../../contexts/MenuContext';
import { rrulestr, RRule } from 'rrule';
import Strings from '../../constants/strings';

const SectionHeader = withStyles({
  root: {
    color: '#000',
  },
})(Typography);

function getMenuAvailablity({ availability } = {}, communityTimezone) {
  if (!availability) {
    const startDate = DateTime.local({ zone: communityTimezone })
      .endOf('week')
      .startOf('day');

    const endDate = DateTime.local({ zone: communityTimezone })
      .plus({ weeks: 1 })
      .endOf('day');

    const recurrence = new RRule({
      interval: 1,
      freq: RRule.WEEKLY,
      dtstart: startDate.toJSDate(),
      until: endDate.toJSDate(),
    });

    return {
      startDate,
      endDate,
      recurrence,
    };
  }

  const startDate = DateTime.fromISO(availability.startDate, {
    zone: communityTimezone,
  }).startOf('day');

  const endDate = DateTime.fromISO(availability.endDate, {
    zone: communityTimezone,
  }).endOf('day');

  const recurrence = availability.recurrence
    ? rrulestr(availability.recurrence)
    : new RRule({
        interval: 1,
        freq: RRule.WEEKLY,
        dtstart: startDate.toJSDate(),
        until: endDate.toJSDate(),
      });

  return {
    startDate,
    endDate,
    recurrence,
  };
}

function getMenuSections({ sections } = {}) {
  if (!sections) {
    return [
      {
        name: 'Breakfast',
        availability: {
          start: DateTime.local()
            .set({ hour: 7, minute: 0 })
            .startOf('minutes'),
          end: DateTime.local().set({ hour: 10, minute: 0 }).startOf('minutes'),
        },
      },
      {
        name: 'Lunch',
        availability: {
          start: DateTime.local()
            .set({ hour: 11, minute: 0 })
            .startOf('minutes'),
          end: DateTime.local().set({ hour: 14, minute: 0 }).startOf('minutes'),
        },
      },
      {
        name: 'Dinner',
        availability: {
          start: DateTime.local()
            .set({ hour: 17, minute: 0 })
            .startOf('minutes'),
          end: DateTime.local().set({ hour: 20, minute: 0 }).startOf('minutes'),
        },
      },
    ];
  }

  return sections.map((section) => ({
    id: section._id,
    name: section.name,
    availability: section.availability
      ? {
          start: DateTime.fromISO(section.availability.start),
          end: DateTime.fromISO(section.availability.end),
        }
      : null,
  }));
}

function getInitialValues(currentMenu, restaurants, communityTimezone) {
  return {
    id: get(currentMenu, '_id', ''),
    name: get(currentMenu, 'name', ''),
    restaurant: get(currentMenu, 'restaurant._id', restaurants[0]?._id),
    audiences: get(currentMenu, 'audiences', ['Resident']),
    availability: getMenuAvailablity(currentMenu, communityTimezone),
    sections: getMenuSections(currentMenu),
    menuCycleRepeat: getMenuCycleRepeat(currentMenu, communityTimezone),
  };
}

function getPendingCurrentMenuInitialValues() {
  return {
    menu: null,
    restaurantId: null,
  };
}

function getMenuCycleRepeat(currentMenu, communityTimezone) {
  if (!currentMenu) return 1;

  const {
    startDate,
    endDate,
    recurrence: recurrenceAvailability,
  } = currentMenu.availability || {};
  const recurrence = recurrenceAvailability
    ? rrulestr(recurrenceAvailability)
    : null;

  if (!startDate || !endDate || !recurrence?.options?.interval) return 1;

  const start = DateTime.fromISO(startDate, { zone: communityTimezone });
  const end = DateTime.fromISO(endDate, { zone: communityTimezone }).plus({
    minutes: 1,
  });
  const menuCycleDuration = recurrence.options.interval;

  if (end < start) {
    return 1;
  } else {
    return Math.round(end.diff(start).as('weeks') / menuCycleDuration);
  }
}

export const Mode = {
  EDIT: 'edit',
  ADD: 'add',
};

export default function MenuDrawer({ mode, open, onClose }) {
  const validationSchema = Yup.object().shape({
    restaurant: Yup.string().required(),
    name: Yup.string()
      .min(3, 'Menu name ' + Strings.Dining.drawer.validation.minCharacters)
      .max(70, 'Menu name ' + Strings.Dining.drawer.validation.maxCharacters)
      .test(
        'uniqueName',
        'Menu ' + Strings.Dining.drawer.validation.nameError,
        function (value) {
          if (!value) {
            return true;
          }
          const { path } = this;
          const restaurant = restaurants.find(
            (x) => x._id === values.restaurant
          );

          const exists = restaurant.menus.find(
            (m) =>
              m.name.trim().toLowerCase() ===
                values.name.trim().toLowerCase() && m._id !== values.id
          );

          if (exists && dirty) {
            sendPendoEvent(Strings.Dining.pendoEvent.menu.setupError);
            throw this.createError({
              path,
            });
          }

          return true;
        }
      )
      .required('Please enter a menu name.'),
    availability: Yup.object().shape({
      startDate: Yup.date().required(),
      endDate: Yup.date().required(),
      recurrence: Yup.object().nullable().optional(),
    }),
    sections: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(),
        availability: Yup.object().shape({
          start: Yup.date().required(),
          end: Yup.date().required(),
        }),
      })
    ),
    audiences: Yup.array().of(Yup.string()),
    menuCycleRepeat: Yup.number()
      .integer()
      .min(1, Strings.Menu.menuCycle)
      .max(52, Strings.Menu.menuCycle)
      .required('Please enter a repeat menu cycle.'),
  });

  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const {
    restaurants,
    loading: loadingRefetchRestaurants,
    refetch: refetchRestaurants,
    setCurrentRestaurant,
  } = React.useContext(RestaurantContext);
  const { currentMenu, setCurrentMenu } = React.useContext(MenuContext);
  const [pendingCurrentMenu, setPendingCurrentMenu] = React.useState(
    getPendingCurrentMenuInitialValues()
  );
  const [user] = useCurrentUser();
  const communityTimezone =
    user?.community?.timezone?.name || 'America/New_York';
  const [initialValues, setInitialValues] = React.useState(
    getInitialValues(currentMenu, restaurants, communityTimezone)
  );

  React.useEffect(() => {
    let values = null;
    switch (mode) {
      case Mode.EDIT:
        values = getInitialValues(currentMenu, restaurants, communityTimezone);
        break;
      case Mode.ADD:
        values = getInitialValues({}, restaurants, communityTimezone);
        break;
    }
    setInitialValues(values);
  }, [currentMenu, mode, open, communityTimezone]);

  const [createMenu, { loading: loadingCreationSubmission }] = useMutation(
    CREATE_MENU,
    {
      async onCompleted(data) {
        await handleCompletedMutation(data.community.createMenu);
      },
      onError(err) {
        if (err.message.match('409')) {
          sendPendoEvent(Strings.Dining.pendoEvent.menu.setupError);
          setFieldError('name', 'This menu name already exists.');
        }
      },
    }
  );
  const [updateMenu, { loading: loadingUpdateSubmission }] = useMutation(
    UPDATE_MENU,
    {
      async onCompleted(data) {
        await handleCompletedMutationEditMenu(data.community.updateMenu);
      },
    }
  );

  async function onSubmit() {
    switch (mode) {
      case Mode.EDIT:
        sendPendoEvent(Strings.Dining.pendoEvent.menu.setupSave);
        return await updateMenu({
          variables: {
            communityId: getCommunityId(),
            input: {
              id: currentMenu._id,
              ...getInputValues(),
            },
          },
        });
      case Mode.ADD:
        sendPendoEvent(Strings.Dining.pendoEvent.menu.newMenu);
        return await createMenu({
          variables: {
            communityId: getCommunityId(),
            input: getInputValues(),
          },
        });
    }
  }

  function getInputValues() {
    return {
      restaurantId: values.restaurant,
      name: values.name,
      audiences: values.audiences,
      availability: values.availability
        ? {
            startDate: values.availability.startDate.toISO(),
            endDate: values.availability.endDate.toISO(),
            rrule: values.availability?.recurrence?.options.interval
              ? values.availability.recurrence.toString()
              : null,
          }
        : null,
      sections: values.sections.map((meal, index) => ({
        id: meal.id,
        name: meal.name,
        displayOrder: isEmpty(enabledDiningIntegrations)
          ? index
          : meal.displayOrder,
        start: meal.availability ? meal.availability.start.toISOTime() : null,
        end: meal.availability ? meal.availability.end.toISOTime() : null,
      })),
    };
  }

  async function handleCompletedMutation(data) {
    formik.resetForm({ dirty: false });
    showToast(Strings.Restaurant.change);
    onClose();
    const inputValues = getInputValues();
    setPendingCurrentMenu({
      menu: data.menu._id,
      restaurantId: inputValues.restaurantId,
    });
    await refetchRestaurants();
  }

  async function handleCompletedMutationEditMenu(data) {
    formik.resetForm({ dirty: false });
    showToast(Strings.Restaurant.change);
    onClose();
    const inputValues = getInputValues();
    const dataRestaurants = await refetchRestaurants();
    const restaurant = dataRestaurants.data.community.restaurants.edges.find(
      ({ node }) => node._id === inputValues.restaurantId
    );
    const restaurantCopy = cloneDeep(restaurant);
    const menu = restaurantCopy?.node.menus.edges.find(
      ({ node }) => node._id === data.menu.ID
    );
    if (menu) {
      const nextMenu = menu.node;
      nextMenu.restaurant = restaurantCopy.node;
      setCurrentMenu(nextMenu);
    }
  }

  React.useEffect(() => {
    if (!loadingRefetchRestaurants && mode === Mode.ADD) {
      const restaurant = restaurants.find(
        (x) => x._id === pendingCurrentMenu.restaurantId
      );
      const menu = restaurant?.menus.find(
        (x) => x._id === pendingCurrentMenu.menu
      );

      if (menu) {
        setCurrentRestaurant(restaurant);
        setCurrentMenu(menu);
        setPendingCurrentMenu(getPendingCurrentMenuInitialValues());
      }
    }
  }, [loadingRefetchRestaurants, restaurants, pendingCurrentMenu, mode]);

  function mapMealOption(option) {
    return {
      id: option.name,
      displayText: option.name,
      value: option.value,
      getChecked(value, option) {
        return value === option.name;
      },
    };
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
    validateOnMount: false,
  });
  const {
    errors,
    touched,
    values,
    dirty,
    handleBlur,
    handleSubmit,
    handleChange,
    setFieldValue,
    setFieldError,
  } = formik;

  const options = [
    {
      id: 'breakfast',
      name: 'Breakfast',
      value: 'Breakfast',
    },
    {
      id: 'brunch',
      name: 'Brunch',
      value: 'Brunch',
    },
    {
      id: 'lunch',
      name: 'Lunch',
      value: 'Lunch',
    },
    {
      id: 'dinner',
      name: 'Dinner',
      value: 'Dinner',
    },
    {
      id: 'allDay',
      name: 'All Day',
      value: 'All Day',
    },
  ];

  const mealOptions = options
    .filter((item) => {
      // Only show sections that are not selected
      const selectedSectionNames = values.sections.map(
        (section) => section.name
      );
      return !selectedSectionNames.includes(item.value);
    })
    .map(mapMealOption);

  const [isSaveDisabled, setIsSaveDisabled] = React.useState(false);
  const { enabledDiningIntegrations } = React.useContext(IntegrationsContext);
  React.useEffect(() => {
    if (!formik || !isEmpty(enabledDiningIntegrations))
      return setIsSaveDisabled(true);
    setIsSaveDisabled(!formik.isValid);
  }, [formik, enabledDiningIntegrations]);

  function handleClose() {
    if (dirty && !showConfirmation) {
      setShowConfirmation(true);
    } else {
      formik.resetForm({
        values: initialValues,
        initialValues: initialValues,
      });
      setShowConfirmation(false);
      onClose();

      switch (mode) {
        case Mode.ADD:
          return sendPendoEvent(Strings.Dining.pendoEvent.menu.newMenuCancel);
        case Mode.EDIT:
          return sendPendoEvent(Strings.Dining.pendoEvent.menu.menuSetupCancel);
      }
    }
  }

  function handleCancel() {
    formik.resetForm({
      values: initialValues,
      initialValues: initialValues,
    });
    onClose();
  }

  function handleRestaurantChange(value) {
    setFieldValue('restaurant', value);
  }

  function handleRecurrenceChange(value) {
    if (!isEqual(values.availability.recurrence, value)) {
      setFieldValue('availability.recurrence', value);
    }
  }

  function handleStartDateChange(value) {
    const startDate = DateTime.fromJSDate(value, {
      zone: communityTimezone,
    }).startOf('day');
    setFieldValue('availability.startDate', startDate);
  }

  function handleAudienceChange(value) {
    setFieldValue(
      'audiences',
      value.map((v) => (v.value ? v.value : v))
    );
  }

  function getMenuDurationInWeeks() {
    const menuCycleRepeat = parseInt(values.menuCycleRepeat || 1);
    const menuCycleDuration =
      values.availability?.recurrence?.options?.interval || 1;
    return menuCycleRepeat * menuCycleDuration;
  }

  function handleMenuCycleRepeat({ target }) {
    const val = target.value;
    if (
      val === '' ||
      (val.match(/^\d+$/) && parseInt(val) >= 1 && parseInt(val) <= 52)
    ) {
      setFieldValue('menuCycleRepeat', val);
    }
  }

  React.useEffect(() => {
    if (mode !== Mode.EDIT || dirty) {
      const menuCycleRepeat = parseInt(values.menuCycleRepeat);
      if (menuCycleRepeat) {
        const startDate = values.availability.startDate;
        const menuCycleDuration =
          values.availability?.recurrence?.options?.interval || 1;
        const endDate = startDate
          .plus({ weeks: menuCycleRepeat * menuCycleDuration })
          .minus({ days: 1 })
          .endOf('day');
        setFieldValue('availability.endDate', endDate);
      }
    }
  }, [
    values.availability?.startDate,
    values.availability?.recurrence,
    values.menuCycleRepeat,
    dirty,
    mode,
  ]);

  function createSetFieldFnByIndex(key, index) {
    return (field, value) => setFieldValue(`${key}[${index}].${field}`, value);
  }

  function hasError(field) {
    return Boolean(get(errors, field) && get(touched, field));
  }

  function getErrorMessage(field) {
    return get(errors, field) && get(touched, field) ? get(errors, field) : '';
  }

  function handleCloseConfirm() {
    if (Mode.ADD === mode) {
      sendPendoEvent(Strings.Dining.pendoEvent.menu.newMenuCancel);
    }

    handleClose();
  }

  const IntegrationAlert = withStyles({
    root: {
      color: '#000',
      backgroundColor: '#FFE7A1',
      fontWeight: '500',
      fontSize: '14px',
      padding: '3px 16px',
    },
  })(Alert);

  function footerRenderer() {
    return showConfirmation ? (
      <DiningDrawerCloseConfirmation
        onConfirm={handleCloseConfirm}
        onCancel={() => setShowConfirmation(false)}
        message={Strings.Dining.drawer.closeConfirmation}
        confirmText="Cancel"
        confirmColor="secondary"
      />
    ) : (
      <>
        {!isEmpty(enabledDiningIntegrations) && (
          <Box style={{ position: 'absolute', bottom: '50px', zIndex: 1300 }}>
            <IntegrationAlert severity="warning" icon={false}>
              Dining integration enabled; Menus are read-only. Use your dining
              provider to update restaurant information.
            </IntegrationAlert>
          </Box>
        )}
        <DiningDrawerFooter>
          <DiningDrawerFooterAction
            id="MD_menu-cancel-Btn"
            onClick={handleClose}
          >
            Cancel
          </DiningDrawerFooterAction>
          <DiningDrawerFooterAction
            disabled={
              loading || (!formik.isValid && isEmpty(enabledDiningIntegrations))
            }
            color="primary"
            id="MD_menu-save-Btn"
            onClick={onSubmit}
          >
            Save
          </DiningDrawerFooterAction>
        </DiningDrawerFooter>
      </>
    );
  }
  const loading = loadingCreationSubmission || loadingUpdateSubmission;
  const menuDurationInWeek = getMenuDurationInWeeks();

  return (
    <DiningDrawer
      confirmOnClose
      open={open}
      loading={loading}
      onClose={handleClose}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      saveDisabled={isSaveDisabled || loading}
      headerText="Menu Setup"
      footerRenderer={footerRenderer}
    >
      <Box p={2}>
        <Box>
          <RestaurantSelector
            name="restaurant"
            variant="outlined"
            options={restaurants}
            error={hasError('restaurant')}
            helperText={getErrorMessage('restaurant')}
            value={values.restaurant}
            onChange={handleRestaurantChange}
            onBlur={handleBlur}
            disabled={!isEmpty(enabledDiningIntegrations)}
          />
        </Box>
        <Box mt={1}>
          <FormTextfield
            required
            id="MD_Menu-Name"
            name="name"
            label="Name"
            variant="outlined"
            value={values.name}
            error={hasError('name')}
            helperText={getErrorMessage('name')}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!isEmpty(enabledDiningIntegrations)}
          />
        </Box>

        <Box mt={3} id="MD_Menu-Schedule">
          <SectionHeader variant="body2">Schedule</SectionHeader>
          <Box mt={2} display="flex" flexDirection="column">
            <StartDateSelector
              name="availability.startDate"
              error={hasError('availability.startDate')}
              helperText={getErrorMessage('availability.startDate')}
              value={values.availability.startDate}
              onChange={handleStartDateChange}
              onBlur={handleBlur}
              disabled={!isEmpty(enabledDiningIntegrations)}
              disabledDays={[1, 2, 3, 4, 5, 6]}
            />
          </Box>
          <Box>
            <AvailabilitySelector
              variant="outlined"
              name="availability.recurrence"
              value={values.availability.recurrence}
              startDate={values.availability.startDate}
              endDate={values.availability.endDate}
              error={hasError('availability.recurrence')}
              helperText={getErrorMessage('availability.recurrence')}
              onChange={handleRecurrenceChange}
              onBlur={handleBlur}
              disabled={!isEmpty(enabledDiningIntegrations)}
            />
          </Box>
          <Box>
            <RepeatMenuCycleSelector
              variant="outlined"
              type="number"
              id="MD-menu-cycle-dropdown"
              name="menuCycleRepeat"
              value={values.menuCycleRepeat}
              endDate={values.availability.endDate}
              onChange={handleMenuCycleRepeat}
              onBlur={handleBlur}
              error={hasError('menuCycleRepeat')}
              helperText={getErrorMessage('menuCycleRepeat')}
              disabled={!isEmpty(enabledDiningIntegrations)}
            />
          </Box>

          <Box display="flex" flexDirection="column" mt={2}>
            <Typography
              variant="caption"
              style={{ fontWeight: 600, color: 'rgba(0, 0, 0, 0.87)' }}
            >
              Menu will run{' '}
              {values?.availability?.startDate?.toFormat('LLLL dd')} until{' '}
              {values?.availability?.endDate?.toFormat('LLLL dd')}
            </Typography>
            <Typography
              variant="caption"
              style={{ color: 'rgba(0, 0, 0, 0.87)' }}
            >
              This menu will last for {menuDurationInWeek}{' '}
              {menuDurationInWeek > 1 ? 'weeks' : 'week'}
            </Typography>
          </Box>
        </Box>

        <Box mt={2}>
          <SectionHeader variant="body2">Meals</SectionHeader>

          <Box mt={1} pb={1}>
            <Typography variant="caption">
              Note: Three meals are required, however if you do not enter menu
              items in meal, that meal will not be read or shown on app, voice,
              or digital signage.
            </Typography>
          </Box>

          {values.sections.map((meal, index) => {
            const currentMealOption = mapMealOption(
              options.find((x) => x.value === meal.name)
            );
            return (
              <Box key={index}>
                <MealSelector
                  index={index}
                  meal={meal}
                  mealOptions={[currentMealOption, ...mealOptions]}
                  error={hasError(`sections[${index}]`)}
                  helperText={getErrorMessage(`sections[${index}]`)}
                  setFieldValue={createSetFieldFnByIndex('sections', index)}
                  onBlur={handleBlur}
                  disabled={!isEmpty(enabledDiningIntegrations)}
                />
              </Box>
            );
          })}
        </Box>

        <Box
          mt={3}
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          id="MD_Menu-Audiences"
        >
          <SectionHeader variant="body2">Audience</SectionHeader>
          <AudienceSelector
            value={values.audiences}
            onChange={handleAudienceChange}
          />
        </Box>
      </Box>
    </DiningDrawer>
  );
}
