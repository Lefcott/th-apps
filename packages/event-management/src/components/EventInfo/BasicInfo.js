/** @format */

import React from 'react';
import { clone, isEqual, isNil, isNull, intersectionBy, remove } from 'lodash';
import { Grid, MenuItem } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { FormTextfield, FormDropdown } from '../../utils/formComponents';
import { Header, HeaderName } from '../styleUtils';
import strings from '../../constants/strings';

function BasicInfo(props) {
  const { values, handleChange, errors, touched, filters, disabled } = props; // setFieldTouched should that be being used for anything?
  const hasError = (field) => errors[field] && touched[field];

  const calendarsArr = clone(filters.eventCalendars);
  remove(calendarsArr, (cal) => isEqual(cal.name, 'Unassigned'));
  let calValues = intersectionBy(calendarsArr, values['calendars'], '_id');
  const calOnChange = (_, value) => props.setFieldValue('calendars', value);

  return (
    <Grid container spacing={3} style={{ padding: '0 25px' }}>
      <Grid item xs={12}>
        <Header data-testid="EI_basic-info-header">
          <HeaderName
            heading={strings.Event.title}
            icon={
              <FontAwesomeIcon
                icon={faCalendar}
                style={{ marginRight: '12px' }}
              />
            }
          />
        </Header>
      </Grid>
      <Grid item xs={12}>
        <FormTextfield
          required
          name="name"
          label={strings.Event.inputs.name}
          onChange={handleChange}
          value={values['name']}
          data-testid="EI_basic-info-event-name-text-field"
          error={hasError('name')}
          helperText={hasError('name') && errors.name}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12}>
        <FormTextfield
          name="description"
          label={strings.Event.inputs.description}
          multiline
          onChange={handleChange}
          value={values['description']}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12}>
        <FormDropdown
          name="location"
          label={strings.Event.inputs.location}
          data-testid="EI_basic-info-event-location-dropdown"
          onChange={handleChange}
          value={values['location']}
          disabled={disabled}
        >
          <MenuItem value={null} disabled={isNull(values['location'])}>
            {strings.Event.removeSelectedLocation}
          </MenuItem>
          {filters.eventLocations.map((loc) => (
            <MenuItem key={loc._id} value={loc._id}>
              {loc.name}
            </MenuItem>
          ))}
        </FormDropdown>
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          multiple
          options={calendarsArr}
          getOptionLabel={(cal) => (isNil(cal) ? '' : cal.name)}
          value={calValues}
          onChange={calOnChange}
          disabled={disabled}
          renderInput={(params) => (
            <FormTextfield
              {...params}
              required
              name="calendars"
              label={strings.Event.inputs.calendars}
              data-testid="EI_basic-info-event-cal-text-field"
              error={hasError('calendars')}
              helperText={hasError('calendars') && errors.calendars}
              disabled={disabled}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

export default BasicInfo;
