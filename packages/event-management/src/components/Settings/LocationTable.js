/** @format */

import React from 'react';
import MuiTable from '../MuiTable';
import { Grid, TextField as MuiTextfield } from '@material-ui/core';
import { ColorBlock } from '../styleUtils';
import { getOneSearchParam } from '../../utils/url';
import {
  ADD_LOCATION,
  UPDATE_LOCATION,
  REMOVE_LOCATION,
} from '../../graphql/events';
import { useMutation } from '@teamhub/apollo-config';
import { showErrorToast } from '@teamhub/toast';
import strings from '../../constants/strings';
import ColorPicker from './ColorPicker';

function LocationTable(props) {
  const { locations, refetchFilters } = props;

  const communityId = getOneSearchParam('communityId', '14');
  const [addLocation] = useMutation(ADD_LOCATION);
  const [updateLocation] = useMutation(UPDATE_LOCATION);
  const [removeLocation] = useMutation(REMOVE_LOCATION, {
    onError: (error) => {
      if (error.graphQLErrors?.[0]?.extensions?.code !== 'locationNotFound') {
        showErrorToast();
        throw error;
      }
    },
  });

  let hasErrorInNameField = false;
  let hasErrorInAbbrField = false;

  return (
    <Grid container style={{ maxHeight: 600 }} id="Em_settingsLocations">
      <MuiTable
        columns={[
          {
            title: strings.LocationTable.columns.name,
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
                  placeholder={`${strings.LocationTable.columns.name} *`}
                  inputProps={{ style: { fontSize: 13 } }}
                  error={hasErrorInNameField}
                  helperText={helperText}
                />
              );
            },
          },
          {
            title: strings.LocationTable.columns.abbreviation,
            field: 'abbr',
            initialEditValue: '',
            validate: (rowData) => rowData.abbr !== '',
            editComponent: (props) => {
              const helperText = hasErrorInAbbrField
                ? strings.LocationTable.validations.abbreviation
                : null;

              return (
                <MuiTextfield
                  value={props.value}
                  onChange={(e) => {
                    if (e.target.value) {
                      hasErrorInAbbrField = false;
                    } else {
                      hasErrorInAbbrField = true;
                    }
                    props.onChange(e.target.value);
                  }}
                  placeholder={`${strings.LocationTable.columns.abbreviation} *`}
                  inputProps={{ maxLength: 3, style: { fontSize: 13 } }}
                  error={hasErrorInAbbrField}
                  helperText={helperText}
                />
              );
            },
          },
          {
            title: strings.LocationTable.columns.color,
            field: 'color',
            searchable: false,
            render: (rowData) => <ColorBlock color={rowData.color} />,
            initialEditValue: '#000000',
            editComponent: ColorPicker,
          },
        ]}
        data={locations}
        editable={{
          onRowAdd: async (newData) => {
            const { name, color, abbr } = newData;
            await addLocation({
              variables: { communityId, name, color, abbr },
            });
            await refetchFilters();
          },
          onRowAddCancelled: () => {
            hasErrorInNameField = false;
            hasErrorInAbbrField = false;
          },
          onRowUpdateCancelled: () => {
            hasErrorInNameField = false;
            hasErrorInAbbrField = false;
          },
          onRowUpdate: async (newData) => {
            const { _id, name, color, abbr } = newData;
            await updateLocation({
              variables: { communityId, id: _id, name, color, abbr },
            });
            await refetchFilters();
          },
          onRowDelete: async (oldData) => {
            await removeLocation({
              variables: { communityId, id: oldData._id },
            });
            await refetchFilters();
          },
        }}
        localization={{
          body: {
            editRow: { deleteText: strings.LocationTable.deleteConfirmation },
          },
        }}
      />
    </Grid>
  );
}

export default LocationTable;
