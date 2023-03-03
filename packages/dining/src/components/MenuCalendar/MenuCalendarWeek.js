/** @format */

import React from 'react';
import { range } from 'lodash';
import { Box } from '@material-ui/core';

import MenuCalendarDay from './MenuCalendarDay';

export default function MenuCalendarWeek({
  onMenuItemDrawerOpen,
  meal,
  currentWeek,
  menuSection,
}) {
  const days = range(0, 7);

  return (
    <Box
      flex={1}
      display="flex"
      overflow="hidden"
      id="MD_menu-Item-Drawer-open"
    >
      {days.map((i) => (
        <MenuCalendarDay
          key={i}
          day={i}
          meal={meal}
          currentWeek={currentWeek}
          onEditClick={onMenuItemDrawerOpen}
          availableMenuItems={menuSection?.[`day${i}`]}
          menuSection={menuSection}
        />
      ))}
    </Box>
  );
}
