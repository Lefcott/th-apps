/** @format */

import React from 'react';
import './app.css';
import styled from '@emotion/styled';
import MainView from './pages/MainView';
import { GlobalProvider } from './contexts/GlobalContext';
import { sendPendoEvent } from '@teamhub/api';

const AppWrapper = styled.div`
  max-height: 100%;
  overflow-y: auto;
  background: #f6f6fa;
  display: flex;
`;

export default function App() {
  React.useEffect(() => {
    sendPendoEvent('data_export_open');
  }, []);

  return (
    <AppWrapper id="app_wrapper">
      <GlobalProvider>
        <MainView />
      </GlobalProvider>
    </AppWrapper>
  );
}
