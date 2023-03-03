/** @format */

import React from 'react';
import { CircularProgress } from '@material-ui/core';

// Simple full page loader
export default function Loader() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <div
        style={{
          position: 'absolute',
          maxWidth: '400px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CircularProgress color="primary" />
      </div>
    </div>
  );
}
