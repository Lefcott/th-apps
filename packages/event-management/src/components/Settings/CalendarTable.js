/** @format */

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
} from 'react';
import MuiTable from '../MuiTable';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField as MuiTextfield } from '@material-ui/core';
import { getOneSearchParam } from '../../utils/url';
import {
  ADD_CALENDAR,
  UPDATE_CALENDAR,
  REMOVE_CALENDAR,
  GET_SIGNUPS_FOR_CALENDAR,
} from '../../graphql/events';
import { useMutation, useLazyQuery } from '@teamhub/apollo-config';
import CareSettingConfirmationModal from '../CareSettingConfirmationModal';
import CareSettingSelector from '../CareSettingSelector';
import { sendPendoEvent } from '@teamhub/api';
import strings from '../../constants/strings';
import State from '../StateProvider';
import {
  concat,
  flatten,
  get,
  indexOf,
  intersection,
  isEqual,
  uniq,
} from 'lodash';
import moment from 'moment-timezone';

function completeCareSettingName(name) {
  switch (name) {
    case 'Independent':
    case 'Assisted':
      return `${name} Living`;
    default:
      return name;
  }
}

function CalendarTable(props) {
  const {
    calendars: calendarProps,
    refetchFilters,
    careSettings,
    residentGroups,
    residentGroupsEnabled,
  } = props;

  const Context = useContext(State);

  const communityId = getOneSearchParam('communityId', '14');
  const [addCalendar] = useMutation(ADD_CALENDAR);
  const [updateCalendar] = useMutation(UPDATE_CALENDAR);
  const [removeCalendar] = useMutation(REMOVE_CALENDAR);
  const [isModalOpen, setModalOpen] = useState(false);
  const [updateCalendarData, setUpdateCalendarData] = useState(null);
  const classes = useStyles();
  const allCareSettingsOption = useMemo(
    () => ({
      _id: '00000',
      name: `All ${
        residentGroupsEnabled
          ? strings.Calendar.residentGroup + 's'
          : strings.Calendar.careSetting + 's'
      }`,
    }),
    [],
  );
  const [
    loadSignups,
    { called: calledSignups, data: dataSignups },
  ] = useLazyQuery(GET_SIGNUPS_FOR_CALENDAR, {
    variables: {
      communityId,
      calendarIds: updateCalendarData?.newData?._id
        ? [updateCalendarData.newData._id]
        : [],
    },
  });

  const totalOptions = residentGroupsEnabled
    ? [...careSettings, ...residentGroups]
    : careSettings;

  const calendars = calendarProps.map((calendar) => {
    if (!calendar.residentGroups || calendar?.residentGroups?.length < 1) {
      return { ...calendar, residentGroups: totalOptions };
    }

    return calendar;
  });

  const onCalAdd = async (calendarData) => {
    const { name, residentGroups } = calendarData;
    let careSettingIds = residentGroups.map(({ _id }) => _id);

    const { data } = await addCalendar({
      variables: {
        communityId,
        name,
        residentGroups:
          residentGroups.length === totalOptions.length ? [] : careSettingIds,
      },
    });

    const filterArr = Context.filters['eventCalendars'];
    // clone the filter array
    const newArr = [...filterArr];
    // add the new calendar id
    newArr.push(get(data, 'community.calendars.createEventCalendar._id'));
    //update context
    Context.updateFilters('eventCalendars', newArr);
  };

  const onCalEdit = async (newData) => {
    const { _id, name, residentGroups } = newData;
    let careSettingIds = residentGroups.map(({ _id }) => _id);

    await updateCalendar({
      variables: {
        communityId,
        id: _id,
        name,
        residentGroups:
          residentGroups.length === totalOptions.length ? [] : careSettingIds,
      },
    });
  };

  const onCalDelete = async (data) => {
    await removeCalendar({ variables: { communityId, id: data._id } });
    // remove calendar from context
    const filterArr = Context.filters['eventCalendars'];
    const index = indexOf(filterArr, data._id);
    const newArr =
      index >= 0
        ? filterArr.filter((_, i) => i !== index)
        : [...filterArr, data._id];
    Context.updateFilters('eventCalendars', newArr);
  };

  const onModalClickSave = useCallback(async () => {
    if (updateCalendarData) {
      const { newData, oldData, resolve } = updateCalendarData;

      setModalOpen(false);
      await onCalEdit(newData, oldData);
      await refetchFilters();
      setUpdateCalendarData(null);
      // Stop the table loading state
      resolve();
    } else {
      setModalOpen(false);
    }
  }, [updateCalendarData]);

  const onModalClickCancel = useCallback(() => {
    if (updateCalendarData) {
      const { resolve } = updateCalendarData;
      setUpdateCalendarData(null);
      // Stop the table loading state
      resolve();
    }
    setModalOpen(false);
  }, [updateCalendarData]);

  useEffect(() => {
    // Pendo Event when open Calendar on Settings
    sendPendoEvent(strings.Calendar.open);
  }, []);

  useEffect(() => {
    if (
      calledSignups &&
      dataSignups?.community?.eventInstances?.events &&
      !updateCalendarData?.remainingResidents &&
      updateCalendarData?.newData?.residentGroups
    ) {
      let removedResidentGroupsAffectUser = [];
      const remainingResidents = [];
      const events = dataSignups.community.eventInstances.events;
      const { newData, oldData, resolve } = updateCalendarData; // this is got corretly
      const newCareSettingIds = newData.residentGroups.map(({ _id }) => _id);
      const oldCareSettingsId = oldData.residentGroups.map(({ _id }) => _id);
      const removedResidentGroups = oldData.residentGroups.filter(
        ({ _id }) => !newCareSettingIds.includes(_id),
      );
      const removedCareSettingIds = oldCareSettingsId.filter(
        (id) => !newCareSettingIds.includes(id),
      );

      // There are remaining residents only if 'all care setttings' option is not selected
      if (!isEqual(newCareSettingIds, oldCareSettingsId)) {
        events.forEach((event) => {
          event.rsvps.forEach(({ user }) => {
            const userResidentGroupsIds = user.residentGroups.map(
              ({ _id }) => _id,
            );

            const removed = removedResidentGroups
              .filter(({ _id }) =>
                concat(
                  userResidentGroupsIds,
                  user.careSettingFull._id,
                ).includes(_id),
              )
              .map(({ name }) => completeCareSettingName(name));

            if (
              removedCareSettingIds.includes(user.careSettingFull._id) ||
              intersection(userResidentGroupsIds, removedCareSettingIds)
                .length > 0
            ) {
              removedResidentGroupsAffectUser.push(removed);

              const otherEventAssociatedCalendars = event.calendars
                .filter(({ _id }) => _id !== updateCalendarData.newData._id)
                .map(({ _id }) =>
                  calendars.find((calendar) => calendar._id === _id),
                )
                .filter((calendar) => !!calendar);

              const otherResidentAssociatedCalendars = otherEventAssociatedCalendars.filter(
                ({ residentGroups }) => {
                  return residentGroups.find(
                    ({ _id }) =>
                      _id === user.careSettingFull._id ||
                      _id === removedCareSettingIds,
                  );
                },
              );

              if (otherResidentAssociatedCalendars.length < 1) {
                // If the resident is not associated with any other calendar, then it is a remaining resident
                remainingResidents.push({
                  eventName: event.name,
                  time: moment(event.startsAt).format('MMM DD [at] h:mm A'),
                  user: user,
                });
              }
            }
          });
        });
      }

      if (remainingResidents.length === 0) {
        // There is no remaining resident, run the update without showing the modal
        onCalEdit(newData, oldData);
        setUpdateCalendarData(null);
        resolve();
      } else {
        // There are some remaining residents, show the modal before to run the update
        setUpdateCalendarData((updateCalendarData) => ({
          ...updateCalendarData,
          remainingResidents,
          removedResidentGroups: uniq(flatten(removedResidentGroupsAffectUser)),
        }));
        setModalOpen(true);
      }
    }
  }, [
    calledSignups,
    dataSignups,
    updateCalendarData,
    calendars,
    careSettings,
    residentGroups,
  ]);

  let hasErrorInNameField = false;

  return (
    <Grid container id="Em_settingsCalendars" style={{ maxHeight: 600 }}>
      <MuiTable
        columns={[
          {
            title: strings.CalendarTable.inputs.name,
            field: 'name',
            initialEditValue: '',
            maxWidth: 200,
            validate: (rowData) => rowData.name !== '',
            editComponent: (props) => {
              const helperText = hasErrorInNameField
                ? strings.CalendarTable.validations.name
                : null;
              return (
                <MuiTextfield
                  value={props.value}
                  onChange={(e) => {
                    if (e.target.value) {
                      hasErrorInNameField = false;
                    } else {
                      hasErrorInNameField = true;
                    }
                    props.onChange(e.target.value);
                  }}
                  placeholder={`${strings.CalendarTable.inputs.name} *`}
                  inputProps={{ style: { fontSize: 13 } }}
                  error={hasErrorInNameField}
                  helperText={helperText}
                />
              );
            },
          },
          {
            title: `${
              residentGroupsEnabled
                ? strings.Calendar.residentGroup + 's'
                : strings.Calendar.careSetting + 's'
            }`,
            field: 'residentGroups',
            initialEditValue: totalOptions,
            width: 300,
            validate: (row) => row.residentGroups.length > 0,
            render: (rowData) => (
              <span className={classes.span}>
                {rowData.residentGroups?.length &&
                rowData.residentGroups.length === totalOptions.length
                  ? allCareSettingsOption.name
                  : rowData.residentGroups
                      .filter((x) => x)
                      .map(({ name }) => {
                        return completeCareSettingName(name);
                      })
                      .join(', ')}
              </span>
            ),
            editComponent: (props) => {
              const hasError = props.value.length === 0;
              const helperText = hasError
                ? strings.CalendarTable.inputs.residentGroupHelperText(
                    residentGroupsEnabled
                      ? strings.Calendar.residentGroup
                      : strings.Calendar.careSetting,
                  )
                : null;
              return (
                <CareSettingSelector
                  breakWord
                  value={!props.value?.length ? [] : props.value}
                  careSettingsOptions={careSettings}
                  residentGroupsOptions={residentGroups}
                  onChange={(event) => {
                    props.onChange(event);
                  }}
                  hasError={hasError}
                  helperText={helperText}
                  variant="outlined"
                  residentGroupsEnabled={residentGroupsEnabled}
                  allCareSettingsOption={allCareSettingsOption}
                  style={{ maxWidth: 300 }}
                />
              );
            },
          },
        ]}
        data={calendars}
        onSearchChange={() => sendPendoEvent(strings.Calendar.search)}
        editable={{
          onRowAdd: async (newData) => {
            if (!newData.name || newData.name === '') {
              return;
            }
            await onCalAdd(newData);
            await refetchFilters();
            sendPendoEvent(strings.Calendarsave);
          },
          onRowAddCancelled: () => {
            sendPendoEvent(strings.Calendar.cancel);
            hasErrorInNameField = false;
          },
          onRowUpdateCancelled: () => {
            sendPendoEvent(strings.Calendar.cancel);
            hasErrorInNameField = false;
          },
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              if (!newData.name || newData.name === '') {
                return reject();
              }
              // The table loading state will stop when this promise will be resolved or rejected
              setUpdateCalendarData({
                newData,
                oldData,
                resolve,
                reject,
              });

              sendPendoEvent(strings.Calendar.save);

              loadSignups();
              // Getting event signups will trigger getting remaining residents
            }),
          onRowDelete: async (oldData) => {
            await onCalDelete(oldData);
            sendPendoEvent(strings.Calendar.delete);
            await refetchFilters();
          },
        }}
        localization={{
          body: {
            editRow: { deleteText: strings.CalendarTable.deleteConfirmation },
          },
        }}
      />
      {updateCalendarData?.remainingResidents &&
        updateCalendarData?.newData?.residentGroups && (
          <CareSettingConfirmationModal
            details={updateCalendarData?.remainingResidents}
            residentGroupsRemoved={updateCalendarData?.removedResidentGroups}
            residentGroupsEnabled={residentGroupsEnabled}
            open={isModalOpen}
            onClose={onModalClickCancel}
            onSave={onModalClickSave}
          />
        )}
    </Grid>
  );
}

const useStyles = makeStyles(() => ({
  option: {
    '&:first-child': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
    },
  },
  span: {
    display: 'inline-block',
    width: 300,
    maxWidth: 300,
    overflowY: 'scroll',
    maxHeight: 118,
    wordBreak: 'break-all',
    paddingRight: '18px',
  },
}));

export default CalendarTable;
