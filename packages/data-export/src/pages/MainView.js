/** @format */

import React from 'react';
import AppContainer from '../components/base/BaseAppContainer';
import { AppUsageExport } from '../components';
import { DirectoryExport } from '../components';

export default function MainView() {
  return (
    <AppContainer>
      <DirectoryExport />
      <AppUsageExport />
    </AppContainer>
  );
}
