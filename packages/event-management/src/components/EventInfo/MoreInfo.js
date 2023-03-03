/** @format */

import React from 'react';
import { Grid, MenuItem } from '@material-ui/core';
import { isNull, clone, isEqual, remove } from 'lodash';
import {
  FormDropdown,
  FormCheckbox,
  FormTextfield,
} from '../../utils/formComponents';
import {
  Header,
  HeaderName,
  MuiFAIconStyling,
  CheckboxContainer,
} from '../styleUtils';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import strings from '../../constants/strings';

function MoreInfo(props) {
  const { values, handleChange, errors, touched, eventTypes, disabled } = props;
  const hasError = (field) => errors[field] && touched[field];

  const typesArr = clone(eventTypes);
  remove(typesArr, (type) => isEqual(type.name, 'Unassigned'));

  const limitedOnChange = (e) => {
    const isChecked = e.target.checked;
    const val = isChecked ? 1 : null;
    props.setFieldValue('numSpots', val);
  };

  const spotsOnChange = (e) =>
    props.setFieldValue('numSpots', parseInt(e.target.value));

  return (
    <Grid container spacing={3} style={{ padding: '0 25px' }}>
      <Grid item xs={12}>
        <Header>
          <HeaderName
            heading={strings.Event.moreInfo.title}
            icon={<InfoOutlinedIcon style={MuiFAIconStyling} />}
          />
        </Header>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormDropdown
          name="eventType"
          label={strings.Event.inputs.eventType}
          onChange={handleChange}
          value={values['eventType']}
          disabled={disabled}
        >
          <MenuItem value={null} disabled={isNull(values['eventType'])}>
            {strings.Event.moreInfo.removeSelectedEventType}
          </MenuItem>
          {typesArr.map((type) => (
            <MenuItem key={type._id} value={type._id}>
              {type.name}
            </MenuItem>
          ))}
        </FormDropdown>
      </Grid>
      <CheckboxContainer item xs={12}>
        <FormCheckbox
          name="costsMoney"
          label={strings.Event.inputs.costsMoney}
          onChange={handleChange}
          value={values['costsMoney']}
          checked={values['costsMoney']}
          disabled={disabled}
        />
      </CheckboxContainer>
      <CheckboxContainer style={{ display: 'flex' }} item xs={12}>
        <FormCheckbox
          label={strings.Event.inputs.limitedSpots}
          onChange={limitedOnChange}
          checked={!isNull(values.numSpots)}
          style={{ flexShrink: 0 }}
          disabled={disabled}
        />
        {!isNull(values.numSpots) ? (
          <FormTextfield
            name="numSpots"
            type="number"
            value={values['numSpots']}
            onChange={spotsOnChange}
            error={hasError('numSpots')}
            helperText={hasError('numSpots') && errors.numSpots}
            disabled={disabled}
          />
        ) : null}
      </CheckboxContainer>
    </Grid>
  );
}

export default MoreInfo;
