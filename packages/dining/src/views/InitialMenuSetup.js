/** @format */

import React from 'react';
import initialMenuSetupSplash from '../images/initial-menu-setup.svg';
import Splash from '../components/Splash';
import { sendPendoEvent } from '@teamhub/api';

export default function InitialMenuSetup({ onMenuDrawerOpen }) {
  const splashAction = {
    text: 'New Menu',
    onClick() {
      sendPendoEvent('dining_newmenu_open');
      onMenuDrawerOpen();
    },
  };

  return (
    <Splash
      image={initialMenuSetupSplash}
      text="This menu is looking a bit hungry."
      action={splashAction}
    />
  );
}
