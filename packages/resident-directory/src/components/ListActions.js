/** @format */

import React, { useState } from 'react';
import { SearchBar } from './reusableComponents';
import { isEqual } from 'lodash';
import useDebounce from '../hooks/useDebounce';
import { useFilters } from './FilterProvider';
import CareSettingFilter from './CareSettingFilter';

function ListActions({ activeId }) {
  const [localSearch, setLocalSearch] = useState('');
  const [filters, setFilters] = useFilters();
  const isSearchDisabled =
    isEqual(activeId, 'new') || isEqual(activeId, undefined);
  let dValue = useDebounce(localSearch, 400);

  React.useEffect(() => {
    setFilters({ search: dValue });
  }, [dValue]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'space-between',
        flexDirection: 'column',
        flexShrink: 0,
        padding: '15px',
      }}
    >
      <SearchBar
        disabled={isSearchDisabled}
        value={localSearch}
        onChange={setLocalSearch}
        label="Search"
        id="Rm_searchbar"
        variant="outlined"
        fullWidth
        style={{ background: '#fff', marginBottom: '10px' }}
      />

      <CareSettingFilter />
    </div>
  );
}

export default ListActions;
