import React from 'react';
import { Typography } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';

export default function EmptyTooltip(props, ref) {
  return (
    <div {...props} ref={ref}>
      <Typography
        style={{
          color: 'rgb(0, 0, 0, 0.38)',
          fontSize: '11px',
          marginRight: '4px',
        }}
      >
        not visible
        <FontAwesomeIcon icon={faInfoCircle} style={{ marginLeft: '4px' }} />
      </Typography>
    </div>
  );
}
