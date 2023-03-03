import React from 'react';
import ContentLoader from 'react-content-loader';
import { CircularProgress } from '@material-ui/core';

export const HorizLoader = () => (
  <ContentLoader
    speed={2}
    width={1500}
    height={210}
    viewBox="0 0 1500 210"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="7" y="11" rx="20" ry="20" width="225" height="200" />
    <rect x="247" y="11" rx="20" ry="20" width="225" height="200" />
    <rect x="485" y="11" rx="20" ry="20" width="225" height="200" />
    <rect x="723" y="10" rx="20" ry="20" width="225" height="200" />
    <rect x="962" y="7" rx="20" ry="20" width="225" height="200" />
    <rect x="1199" y="7" rx="20" ry="20" width="225" height="200" />
    <rect x="1436" y="6" rx="20" ry="20" width="225" height="200" />
  </ContentLoader>
);

export const GridLoader = () => (
  <div style={{ textAlign: 'center', overflow: 'hidden' }}>
    <ContentLoader
      speed={2}
      width={960}
      height={875}
      viewBox="0 0 960 875"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="8" y="10" rx="20" ry="20" width="225" height="200" />
      <rect x="247" y="10" rx="20" ry="20" width="225" height="200" />
      <rect x="485" y="10" rx="20" ry="20" width="225" height="200" />
      <rect x="723" y="10" rx="20" ry="20" width="225" height="200" />
      <rect x="8" y="225" rx="20" ry="20" width="225" height="200" />
      <rect x="247" y="225" rx="20" ry="20" width="225" height="200" />
      <rect x="485" y="225" rx="20" ry="20" width="225" height="200" />
      <rect x="723" y="225" rx="20" ry="20" width="225" height="200" />
      <rect x="8" y="443" rx="20" ry="20" width="225" height="200" />
      <rect x="247" y="443" rx="20" ry="20" width="225" height="200" />
      <rect x="485" y="443" rx="20" ry="20" width="225" height="200" />
      <rect x="723" y="443" rx="20" ry="20" width="225" height="200" />
      <rect x="8" y="659" rx="20" ry="20" width="225" height="200" />
      <rect x="247" y="659" rx="20" ry="20" width="225" height="200" />
      <rect x="485" y="659" rx="20" ry="20" width="225" height="200" />
      <rect x="723" y="659" rx="20" ry="20" width="225" height="200" />
    </ContentLoader>
  </div>
);

export const FullPageSpinner = () => (
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
      <CircularProgress size={60} />
    </div>
  </div>
);
