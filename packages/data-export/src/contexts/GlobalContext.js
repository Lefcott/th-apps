/** @format */

import React from 'react';
export const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [value, setValue] = React.useState();
  return (
    <GlobalContext.Provider value={{ value, setValue }}>
      {children}
    </GlobalContext.Provider>
  );
};
