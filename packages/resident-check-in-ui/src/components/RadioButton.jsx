import React from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel, Radio } from '@material-ui/core';

const RadioButton = ({ name, checked, onChange }) => (
  <FormControlLabel
    label={ name }
    value={ name }
    checked={ checked }
    control={ <Radio color="primary" /> }
    labelPlacement="end"
    onChange={(e) => onChange(e.target.value)}
    style={{ margin: 0 }}
  />
);

RadioButton.propTypes = {
  name: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func
};

export default RadioButton;