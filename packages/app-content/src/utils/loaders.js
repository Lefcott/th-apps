/** @format */

import React from 'react';
import ContentLoader from 'react-content-loader';
import { CircularProgress } from '@material-ui/core';

export const FormLoader = () => (
  <ContentLoader
    speed={2}
    width={750}
    height={180}
    viewBox="0 0 750 180"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{ width: '100%' }}
  >
    <rect x="22" y="19" rx="0" ry="0" width="704" height="34" />
    <rect x="25" y="89" rx="0" ry="0" width="224" height="29" />
    <rect x="309" y="88" rx="0" ry="0" width="420" height="33" />
    <rect x="25" y="150" rx="0" ry="0" width="140" height="28" />
  </ContentLoader>
);

export const FullPageSpinner = () => (
  <div
    data-testid="AP_full-page-spinner"
    style={{ height: '100vh', width: '100vw' }}
  >
    <div
      style={{
        position: 'absolute',
        maxWidth: '400px',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CircularProgress size={60} />
    </div>
  </div>
);
