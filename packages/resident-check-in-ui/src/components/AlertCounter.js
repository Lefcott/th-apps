import React from 'react';
import { Chip } from '@material-ui/core';
import styled from '@emotion/styled';

export const colors = {
  error: '#dc3545',
  warning: '#ffc107'
}

const CustomChip = styled(Chip)`
  &&& {
    color: #fff;
    background-color: ${props => colors[props.type]}
  }
`

export default function AlertCounter(props) {
  const { type, numAlerts, style } = props;

  return <CustomChip size="small" type={type} label={numAlerts} style={style}/>
}
