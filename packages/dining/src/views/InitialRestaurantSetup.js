/** @format */

import React from 'react';
import initialRestaurantSetupSplash from '../images/initial-restaurant-setup.svg';
import RestaurantsDrawer from '../components/RestaurantsDrawer';
import Splash from '../components/Splash';
import { RestaurantContext } from '../contexts/RestaurantContext';
import { sendPendoEvent } from '@teamhub/api';
import { Box } from '@material-ui/core';

export default function InitialRestaurantSetup(props) {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const splashAction = {
    text: 'Set Up Restaurants',
    id: 'DN_setup-restaurant',
    onClick() {
      sendPendoEvent('dining_setupresto_open');
      setOpenDrawer(true);
    },
  };

  const { restaurants } = React.useContext(RestaurantContext);
  React.useEffect(() => {
    if (restaurants.length) {
      props.setCurrentView('RestaurantScheduler');
    }
  }, [restaurants]);

  return (
    <Box margin="0 auto">
      <Splash
        image={initialRestaurantSetupSplash}
        text="Your dining room is looking empty."
        action={splashAction}
      />
      <RestaurantsDrawer
        setCurrentView={props.setCurrentView}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      />
    </Box>
  );
}
