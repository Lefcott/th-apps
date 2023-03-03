/** @format */

import React from 'react';
import strings from '../constants/strings';
const FilterContext = React.createContext();

const reducer = (oldState, newState) => {
  return { ...oldState, ...newState };
};
export function FilterProvider(props) {
  const [filters, setFilters] = React.useReducer(reducer, {
    search: '',
    careSettings: [],
  });

  const value = [filters, setFilters];
  return (
    <FilterContext.Provider value={value}>
      {props.children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = React.useContext(FilterContext);
  if (!context) {
    throw new Error(strings.FilterProvider.error);
  }

  return context;
}
