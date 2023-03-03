/** @format */

import React from 'react';
import './app.css';
import styled from '@emotion/styled';
import { useMediaQuery, Box } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import InitialRestaurantSetup from './views/InitialRestaurantSetup';
import RestaurantScheduler from './views/RestaurantScheduler';
import { withStyles } from '@material-ui/styles';
import FeatureNotAvailable from './views/FeatureNotAvailable';
import { RestaurantProvider } from './contexts/RestaurantContext';
import { MenuProvider } from './contexts/MenuContext';
import { MenuItemProvider } from './contexts/MenuItemContext';
import { IntegrationsProvider } from './contexts/IntegrationsProvider';
import { sendPendoEvent } from '@teamhub/api';

// code split along new and old, so users dont have to load double the code if not necessary

const AppWrapper = styled.div`
  max-height: 100%;
  overflow-y: auto;
  background: #f6f6fa;
  display: flex;
`;

const AppContent = withStyles(() => ({
  root: {
    display: 'flex',
    margin: '27px 40px',
    border: ' 1px solid #E5E5E5',
    background: '#fff',
    flex: 1,
  },
}))(Box);

export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentView, setCurrentView] = React.useState('RestaurantScheduler');

  React.useEffect(() => {
    sendPendoEvent('dining_open');
  }, []);

  function getView() {
    if (isMobile) return <FeatureNotAvailable />;

    let view = null;
    switch (currentView) {
      case 'InitialRestaurantSetup':
        view = <InitialRestaurantSetup setCurrentView={setCurrentView} />;
        break;
      case 'RestaurantScheduler':
        view = <RestaurantScheduler setCurrentView={setCurrentView} />;
        break;
    }

    return <AppContent>{view}</AppContent>;
  }

  return (
    <AppWrapper id="app_wrapper">
      <IntegrationsProvider>
        <RestaurantProvider>
          <MenuProvider>
            <MenuItemProvider>{getView()}</MenuItemProvider>
          </MenuProvider>
        </RestaurantProvider>
      </IntegrationsProvider>
    </AppWrapper>
  );
}
