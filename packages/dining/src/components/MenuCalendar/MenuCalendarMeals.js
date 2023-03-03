/** @format */

import { Box } from '@material-ui/core';
import React from 'react';
import { MenuContext } from '../../contexts/MenuContext';
import MenuCalendarMealHeader from './MenuCalendarMealHeader';
import MenuCalendarWeek from './MenuCalendarWeek';

export default function MenuCalendarMeals({
  onMenuItemDrawerOpen,
  currentWeek,
  menuSections,
}) {
  const { currentMenu } = React.useContext(MenuContext);
  const { sections } = currentMenu;

  return (
    <Box display="flex" flexDirection="column" flex={1} overflow="hidden">
      {sections.map((meal) => {
        const menuSection = menuSections.find(
          (menuSection) => menuSection._id === meal._id
        );
        return (
          <Box
            overflow="hidden"
            height="33%"
            flexDirection="column"
            display="flex"
            flex={1}
            key={meal.name}
          >
            <MenuCalendarMealHeader meal={meal} />
            <MenuCalendarWeek
              meal={meal}
              currentWeek={currentWeek}
              onMenuItemDrawerOpen={onMenuItemDrawerOpen}
              menuSection={menuSection}
            />
          </Box>
        );
      })}
    </Box>
  );
}
