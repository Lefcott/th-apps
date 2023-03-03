/** @format */

import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  HeaderName,
  MuiFAIconStyling,
  CheckboxContainer,
} from '../styleUtils';
import { FormCheckbox } from '../../utils/formComponents';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import strings from '../../constants/strings';

function MoreInfo(props) {
  const { values, handleChange, disabled } = props;

  return (
    <Grid container spacing={3} style={{ padding: 25 }}>
      <Grid item xs={12}>
        <Header>
          <HeaderName
            heading={strings.Event.widgetOptions.title}
            icon={<SettingsOutlinedIcon style={MuiFAIconStyling} />}
          />
        </Header>
      </Grid>
      <CheckboxContainer item sm={12} md={6}>
        <FormCheckbox
          name="hiddenOn1"
          label={strings.Event.inputs.hideFromDailyCalendar}
          onChange={handleChange}
          value={values['hiddenOn1']}
          checked={values['hiddenOn1']}
          disabled={disabled}
        />
      </CheckboxContainer>
      <CheckboxContainer item sm={12} md={6}>
        <FormCheckbox
          name="noWrap"
          label={strings.Event.inputs.truncateEventName}
          onChange={handleChange}
          value={values['noWrap']}
          checked={values['noWrap']}
          disabled={disabled}
        />
      </CheckboxContainer>
      <CheckboxContainer item sm={12} md={6}>
        <FormCheckbox
          name="hiddenOn7"
          label={strings.Event.inputs.hideFromWeeklyCalendar}
          onChange={handleChange}
          value={values['hiddenOn7']}
          checked={values['hiddenOn7']}
          disabled={disabled}
        />
      </CheckboxContainer>
      <CheckboxContainer item sm={12} md={6}>
        <FormCheckbox
          name="hideEndTime"
          label={strings.Event.inputs.hideEventEndTimes}
          onChange={handleChange}
          value={values['hideEndTime']}
          checked={values['hideEndTime']}
          disabled={disabled}
        />
      </CheckboxContainer>
      <CheckboxContainer item sm={12}>
        <FormCheckbox
          name="hiddenOn30"
          label={strings.Event.inputs.hideFromMonthlyCalendar}
          onChange={handleChange}
          value={values['hiddenOn30']}
          checked={values['hiddenOn30']}
          disabled={disabled}
        />
      </CheckboxContainer>
    </Grid>
  );
}

export default MoreInfo;
