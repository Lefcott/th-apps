/** @format */

import React, { useEffect } from 'react';
import { useSchedules } from '../contexts/ScheduleProvider';
import Searchbar from './Searchbar';
import { DatePicker } from '@material-ui/pickers';
import { sortItems } from '../utilities/data';
import styled from '@emotion/styled';
import {
  MenuItem,
  Grid,
  TextField,
  Hidden,
  InputAdornment,
} from '@material-ui/core';
import { EventTwoTone } from '@material-ui/icons';
import { useDestinations } from '../contexts/DestinationsProvider';
import { useDebouncedCallback } from 'use-debounce';
import { getOneSearchParam } from '../utilities/url-service';

const FilterItem = styled(Grid)`
  padding: 5px;
`;

const Image = styled.img`
  position: relative;
  bottom: 2px;
  right: 10px;
  width: 20px;
  margin-left: 5px;
`;

function ListActions() {
  const destinations = useDestinations();
  const [localSearch, setLocalSearch] = React.useState();
  const { filters, setFilters } = useSchedules();

  const debounced = useDebouncedCallback((value) => {
    onFilterChange('search', value);
  }, 300);
  function onFilterChange(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }


  useEffect(() => {
    const destinationParam = getOneSearchParam('destination');
    if(destinationParam) {
      setFilters({destination: destinationParam})    
    }
  }, [])
  

  return (
    <Grid
      container
      style={{ flex: 0, margin: '5px', width: 'calc(100% - 10px)' }}
    >
      <FilterItem item xs={12} sm={6}>
        <DatePicker
          id="DSM_list-dateFilter"
          label="Date"
          autoOk
          variant="outlined"
          clearable
          inputVariant="outlined"
          format="MM/DD/YYYY"
          value={filters.timestamp}
          onChange={(date) =>
            onFilterChange(
              'timestamp',
              date ? date.endOf('day').toISOString() : null,
            )
          }
          style={{ background: '#fff', width: '100%', cursor: 'pointer' }}
          InputLabelProps={{ shrink: true }}
          inputProps={{ style: { cursor: 'pointer' } }}
          InputProps={{
            style: { cursor: 'pointer' },
            endAdornment: (
              <InputAdornment position="end">
                <EventTwoTone />
              </InputAdornment>
            ),
          }}
        />
      </FilterItem>

      <FilterItem item xs={12} sm={6}>
        <TextField
          name="destination"
          id="DSM_list-destinationFilter"
          value={filters.destination || ''}
          onChange={({ target }) => onFilterChange(target.name, target.value)}
          label="Destination"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          select
          fullWidth
          style={{ background: '#fff' }}
        >
          {[
            <MenuItem key={'Select All Destinations'} value={null}>
              All Destinations
            </MenuItem>,
            destinations.map((dest) => (
              <MenuItem key={dest.name} value={dest.guid}>
                {dest.name}
              </MenuItem>
            )),
          ]}
        </TextField>
      </FilterItem>

      <FilterItem item xs={12} sm={6}>
        <Searchbar
          onChange={(searchTerm) => {
            debounced.callback(searchTerm);
            setLocalSearch(searchTerm);
          }}
          id="DSM_list-searchbar"
          fullWidth
          color="primary"
          variant="outlined"
          label="Search"
          value={localSearch}
          style={{ background: '#fff' }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </FilterItem>

      <Hidden xsDown>
        <FilterItem item xs={12} sm={6}>
          <TextField
            id="DSM_list-sortFilter"
            label="Sort"
            select
            InputLabelProps={{
              shrink: true,
            }}
            SelectProps={{
              SelectDisplayProps: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                },
              },
            }}
            name="sort"
            fullWidth
            variant="outlined"
            style={{ background: '#fff' }}
            value={filters.sort}
            onChange={({ target }) => onFilterChange(target.name, target.value)}
          >
            {sortItems.map((item) => (
              <MenuItem
                key={item.name}
                value={item.value}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Image src={item.icon} alt="sort-icon" />
                <span>{item.name}</span>
              </MenuItem>
            ))}
          </TextField>
        </FilterItem>
      </Hidden>
    </Grid>
  );
}

export default ListActions;
