import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { SearchBar } from '@k4connect/caregiver-components';
import { Autocomplete } from '@material-ui/lab';
import { ResidentContext } from './ResidentProvider';
import { useDebounce } from '../utilities/hooks';

export default function ListActions() {
  const [localSearch, setLocalSearch] = useState('');
  const [_, dispatch] = useContext(ResidentContext);

  const dSearch = useDebounce(localSearch, 400);

  useEffect(() => {
    dispatch({ type: 'UPDATE_SEARCHTERM', payload: dSearch, });
  }, [dSearch]);

  return (
    <Grid container alignItems="center" style={{ backgroundColor: 'rgb(229, 229, 229)', padding: 15, flexShrink: 0, }}>
      <Grid item xs={12} style={{ marginBottom: '10px', }}>
        <SearchBar
          fullWidth
          id="Rci_residentList-searchbar"
          color="primary"
          variant="outlined"
          label="Search"
          value={localSearch}
          onChange={searchTerm => setLocalSearch(searchTerm)}
          style={{ backgroundColor: '#fff', }}
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          multiple
          options={[
            'Alerts not active',
            'Alerts Only',
            'Away',
            'No Alerts',
            'No System',
            'System Issues Only'
          ]}
          id="Rci_residentList-filterBy"
          onChange={(_, value) => dispatch({ type: 'UPDATE_FILTERS', payload: value, })}
          renderInput={params => (
            <TextField
              {...params}
              label='Filter by'
              fullWidth
              variant='outlined'
              style={{ backgroundColor: '#fff', }}
            />
          )}
        />
      </Grid>

    </Grid>
  );
}
