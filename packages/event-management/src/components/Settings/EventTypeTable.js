/** @format */

import React, { useContext } from 'react';
import MuiTable from '../MuiTable';
import { Grid, TextField as MuiTextfield } from '@material-ui/core';
import { ColorBlock } from '../styleUtils';
import { getOneSearchParam } from '../../utils/url';
import {
  ADD_EVENT_TYPE,
  UPDATE_EVENT_TYPE,
  REMOVE_EVENT_TYPE,
} from '../../graphql/events';
import { useMutation } from '@teamhub/apollo-config';
import { showErrorToast } from '@teamhub/toast';
import strings from '../../constants/strings';
import State from '../StateProvider';
import ColorPicker from './ColorPicker';

function EventTypeTable(props) {
  const { types, refetchFilters } = props;

  const Context = useContext(State);
  const communityId = getOneSearchParam('communityId', '14');
  const [addEventType] = useMutation(ADD_EVENT_TYPE);
  const [updateEventType] = useMutation(UPDATE_EVENT_TYPE);
  const [removeEventType] = useMutation(REMOVE_EVENT_TYPE, {
    onError: (error) => {
      if (error.graphQLErrors?.[0]?.extensions?.code !== 'eventTypeNotFound') {
        showErrorToast();
        throw error;
      }
    },
  });

  let hasErrorInNameField = false;

  return (
    <Grid container style={{ maxHeight: 600 }} id="Em_settingsEventTypes">
      <MuiTable
        columns={[
          {
            title: strings.EventTypeTable.columns.name,
            field: 'name',
            initialEditValue: '',
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
                  placeholder={`${strings.EventTypeTable.columns.name} *`}
                  inputProps={{ style: { fontSize: 13 } }}
                  error={hasErrorInNameField}
                  helperText={helperText}
                />
              );
            },
          },
          {
            title: strings.EventTypeTable.columns.color,
            field: 'color',
            searchable: false,
            render: (rowData) => <ColorBlock color={rowData.color} />,
            initialEditValue: '#000000',
            editComponent: ColorPicker,
          },
        ]}
        data={types}
        editable={{
          onRowAdd: async (newData) => {
            const { name, color } = newData;
            const response = await addEventType({
              variables: { communityId, name, color },
            });
            Context.addFilter(
              'eventTypes',
              response.data.community.eventAttributes.createEventType._id,
            );
            await refetchFilters();
          },
          onRowUpdate: async (newData) => {
            const { _id, name, color } = newData;
            await updateEventType({
              variables: { communityId, id: _id, name, color },
            });
            await refetchFilters();
            hasErrorInNameField = false;
          },
          onRowAddCancelled: () => {
            hasErrorInNameField = false;
          },
          onRowUpdateCancelled: () => {
            hasErrorInNameField = false;
          },
          onRowDelete: async (oldData) => {
            await removeEventType({
              variables: { communityId, id: oldData._id },
            });
            Context.removeFilter('eventTypes', oldData._id);
            await refetchFilters();
          },
        }}
        localization={{
          body: {
            editRow: { deleteText: strings.EventTypeTable.deleteConfirmation },
          },
        }}
      />
    </Grid>
  );
}

export default EventTypeTable;
