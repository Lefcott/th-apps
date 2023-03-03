/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import { isNull } from 'lodash';
import { Info, Event } from '@material-ui/icons';
import { Grid, MenuItem } from '@material-ui/core';
import PanelHeader from './PanelHeader';
import { StyledExpansionPanel, SummaryHeader } from '../utils/styledComponents';
import { FormDropdown, FormDatePicker } from '../utils/formComponents';
import strings from '../constants/strings';

function MoreInfoPanel(props) {
  const { readOnly, expanded, activatePanel, resident } = props;

  return (
    <StyledExpansionPanel
      id="Rm_Panel-moreInfo"
      expanded={expanded}
      onChange={activatePanel}
      summary={<PanelHeader icon={Info} label={strings.InfoPanel.moreHeader} />}
      details={
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormDatePicker
              name="moveInDate"
              label="Move-In Date"
              clearable
              iconbutton={<Event />}
              disabled={readOnly}
              format="MMMM dd, yyyy"
              onChange={(date) => props.setFieldValue('moveInDate', date)}
              value={resident['moveInDate']}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormDropdown
              name="residenceType"
              label="Residence Type"
              disabled={readOnly}
              onChange={props.handleChange}
              value={resident['residenceType']}
            >
              <MenuItem
                value={null}
                disabled={isNull(resident['residenceType'])}
              >
                Remove selected residence type
              </MenuItem>
              <MenuItem value="Studio">Studio</MenuItem>
              <MenuItem value="One_Bedroom">One-Bedroom</MenuItem>
              <MenuItem value="Two_Bedroom">Two-Bedroom</MenuItem>
              <MenuItem value="Companion_Suite">Companion Suite</MenuItem>
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Double">Double</MenuItem>
              <MenuItem value="Shared">Shared</MenuItem>
              <MenuItem value="Condo">Condo</MenuItem>
            </FormDropdown>
          </Grid>
        </Grid>
      }
    />
  );
}

MoreInfoPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  activatePanel: PropTypes.func.isRequired,
  resident: PropTypes.object.isRequired,
};

MoreInfoPanel.defaultProps = {
  resident: {},
};

export default MoreInfoPanel;
