/** @format */

import React from 'react';
export const MenuContext = React.createContext();

export const MenuProvider = ({ children }) => {
  const [currentMenu, setCurrentMenu] = React.useState();
  return (
    <MenuContext.Provider value={{ currentMenu, setCurrentMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
