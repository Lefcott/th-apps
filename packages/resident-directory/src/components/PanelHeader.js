import React from 'react';
import { Grid } from '@material-ui/core';
import { SummaryHeader } from '../utils/styledComponents';
import SvgIcon from '@material-ui/core/SvgIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PanelHeader(props) {
  const { icon, label, faIcon } = props;
  return (
    <Grid container alignItems="center">
      {icon && (
        <SvgIcon component={icon} style={{ marginRight: 15, width: 20 }} />
      )}
      {faIcon && (
        <FontAwesomeIcon icon={faIcon} style={{ marginRight: 15, width: 20 }} />
      )}
      <SummaryHeader>{label}</SummaryHeader>
    </Grid>
  );
}
