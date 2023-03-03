/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import ChipsDropdown from './ChipsDropdown';
import { isEqual, uniqBy, isEmpty, intersectionBy } from 'lodash';
import { Grid, MenuItem } from '@material-ui/core';

function ScheduleDestinations(props) {
  const { destOptions, values, errors, setFieldValue } = props;
  const selected = !isEmpty(destOptions)
    ? intersectionBy(destOptions, values.destinations, 'guid')
    : [];
  const hasError = errors['destinations'];

  const dropdownSelectionChange = (e) => {
    const selected = e.target.value;
    const isAllSelected = selected.some((item) => isEqual(item, 'all'));
    const selectedArr = isAllSelected ? destOptions : uniqBy(selected, 'guid');
    setFieldValue('destinations', selectedArr);
  };

  const chipItemDelete = (valueToDelete) => {
    const selectedDestinations = selected.filter(
      (option) => !isEqual(option, valueToDelete),
    );
    setFieldValue('destinations', selectedDestinations);
  };

  return (
    <Grid>
      <ChipsDropdown
        label="Destinations"
        value={selected}
        onChange={dropdownSelectionChange}
        chipdelete={chipItemDelete}
        controlprops={{
          error: hasError,
          style: { width: '100%', marginBottom: 10 },
        }}
        helpertext={hasError ? errors.destinations : null}
      >
        <MenuItem value="all">All Destinations</MenuItem>
        {destOptions.map((option) => (
          <MenuItem key={option.guid} value={option}>
            {option.name}
          </MenuItem>
        ))}
      </ChipsDropdown>
    </Grid>
  );
}

ScheduleDestinations.propTypes = {
  destOptions: PropTypes.array.isRequired,
};

export default ScheduleDestinations;
