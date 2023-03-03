/** @format */

import React, { useContext } from 'react';

const SearchContext = React.createContext('');

export function SearchProvider(props) {
  const [value, setValue] = React.useState('');
  const contextValue = { value, setValue };

  return (
    <SearchContext.Provider value={contextValue}>
      {props.children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);

  return [context.value, context.setValue];
}
