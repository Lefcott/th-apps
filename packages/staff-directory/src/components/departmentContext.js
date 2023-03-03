/** @format */

import React from 'react';

const DepartmentContext = React.createContext({});

export const DepartmentProvider = (props) => {
  const [departments, setDepartments] = React.useState([]);

  const value = { departments, setDepartments };

  return (
    <DepartmentContext.Provider value={value}>
      {props.children}
    </DepartmentContext.Provider>
  );
};

export const useDepartments = () => {
  const context = React.useContext(DepartmentContext);
  if (context === undefined) {
    throw new Error('useDepartments must be used within a DepartmentProvider');
  }
  return [context.departments, context.setDepartments];
};
