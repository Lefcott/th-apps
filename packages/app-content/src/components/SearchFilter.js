/** @format */

import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { useDebounce } from '../utils/hooks';
import { TextField, InputAdornment } from '@material-ui/core';
import { Search, Clear } from '@material-ui/icons';

function SearchFilter(props) {
  const { keyword, setKeyword } = props;
  const [search, setSearch] = useState(keyword);
  const dSearch = useDebounce(search, 500);

  const onSearchChange = (val) => {
    const newKeyword = isEmpty(val) ? '' : val;
    return setSearch(newKeyword);
  };

  useEffect(() => setKeyword(dSearch), [dSearch]);

  return (
    <TextField
      id="AP_content-search"
      value={search}
      variant="outlined"
      fullWidth
      disabled={props.disabled}
      placeholder="Search by name"
      autoComplete="off"
      onChange={(e) => onSearchChange(e.target.value)}
      inputProps={{ style: { padding: 10 } }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {search.length === 0 ? (
              <Search />
            ) : (
              <Clear
                data-testid="AP_postmodal_search-filter-clear"
                style={{ cursor: 'pointer' }}
                onClick={() => onSearchChange('')}
              />
            )}
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SearchFilter;
