/** @format */

import React from 'react';
export const MenuItemContext = React.createContext({
  info: {},
});

export const MenuItemProvider = ({ children }) => {
  const [currentMenuItem, setCurrentMenuItem] = React.useState();
  const [info, setInfo] = React.useState({});
  const [currentSection, setCurrentSection] = React.useState();
  const [menuSections, setMenuSections] = React.useState();
  const [refetchMenuSections, setRefetchMenuSections] = React.useState();
  const [currentAvailableMenuItems, setCurrentAvailableMenuItems] =
    React.useState();
  const [copiedMenuItems, setCopiedMenuItems] = React.useState([]);

  return (
    <MenuItemContext.Provider
      value={{
        currentMenuItem,
        setCurrentMenuItem,
        info,
        setInfo,
        currentSection,
        setCurrentSection,
        menuSections,
        setMenuSections,
        refetchMenuSections,
        setRefetchMenuSections,
        currentAvailableMenuItems,
        setCurrentAvailableMenuItems,
        copiedMenuItems,
        setCopiedMenuItems
      }}
    >
      {children}
    </MenuItemContext.Provider>
  );
};
