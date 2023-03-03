/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { faBookOpen } from '@fortawesome/pro-solid-svg-icons';
import { StyledExpansionPanel } from '../utils/styledComponents';
import { FormTextfield } from '../utils/formComponents';
import strings from '../constants/strings';
import PanelHeader from './PanelHeader';

function BiographyPanel(props) {
  const { readOnly, expanded, activatePanel, resident } = props;
  const hasError = (field) =>
    props.errors[field] && props.touched[field] ? true : false;

  return (
    <StyledExpansionPanel
      id="Rm_Panel-moreInfo"
      expanded={expanded || hasError('biography')}
      onChange={activatePanel}
      summary={
        <PanelHeader faIcon={faBookOpen} label={strings.InfoPanel.biography} />
      }
      details={
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormTextfield
              required
              multiline
              rows={4}
              maxRows={10}
              name="biography"
              disabled={readOnly}
              onChange={props.handleChange}
              value={resident['biography']}
              error={hasError('biography')}
              helperText={hasError('biography') && props.errors.biography}
            />
          </Grid>
        </Grid>
      }
    />
  );
}

BiographyPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  activatePanel: PropTypes.func.isRequired,
  resident: PropTypes.object.isRequired,
};

BiographyPanel.defaultProps = {
  resident: {},
};

export default BiographyPanel;
