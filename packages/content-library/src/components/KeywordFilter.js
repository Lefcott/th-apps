import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { useDebounce } from '../hooks';
import { TextField, InputAdornment } from '@material-ui/core';
import { Search, Clear } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

const useKeywordFilterStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('md')]: {
      minWidth: 300,
    },
  },
}));

function KeywordFilter(props) {
  const { keyword, setKeyword } = props;
  const keywordFilterClassses = useKeywordFilterStyles();
  const [search, setSearch] = useState(keyword);
  const dSearch = useDebounce(search, 500);

  const onSearchChange = (val) => {
    const newKeyword = isEmpty(val) ? '' : val;
    return setSearch(newKeyword);
  };

  useEffect(() => setKeyword(dSearch), [dSearch, setKeyword]);

  return (
    <TextField
      id="CL_library-search"
      label="Search"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      autoComplete="off"
      classes={keywordFilterClassses}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {search.length === 0 ? (
              <Search />
            ) : (
              <Clear
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

export default KeywordFilter;
