/** @format */

import React from 'react';
import { CircularProgress } from '@material-ui/core';

const OverlayLoading = () => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 200,
      width: '100%',
    }}
  >
    <div
      style={{
        display: 'table',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
      }}
    >
      <div
        style={{
          display: 'table-cell',
          width: '100%',
          height: '100%',
          verticalAlign: 'middle',
          textAlign: 'center',
        }}
      >
        <CircularProgress />
      </div>
    </div>
  </div>
);

export default OverlayLoading;
