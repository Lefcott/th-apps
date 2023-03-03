/** @format */

import React, { useContext } from 'react';
import State from './StateProvider';
import { map, includes, indexOf, pick, forEach, isEqual } from 'lodash';
import { getOneSearchParam } from '../utils/url';
import { filterOptions } from '../utils/componentData';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  CircularProgress,
} from '@material-ui/core';
import { StyledExpansion } from './styleUtils';
import { GET_FILTERS } from '../graphql/events';
import { useQuery } from '@teamhub/apollo-config';

function AdvancedFilters() {
  const Context = useContext(State);

  const communityId = getOneSearchParam('communityId', '14');

  const { data } = useQuery(GET_FILTERS, {
    variables: { communityId },
    onCompleted: (data) => {
      const { eventCalendars } = Context.filters;
      if (isEqual(eventCalendars[0], 'initialCal')) {
        const allFilters = data.community;
        const filterObj = pick(allFilters, ['eventCalendars', 'eventTypes']);
        forEach(filterObj, (val, key) => {
          const valArr = map(val, '_id');
          Context.updateFilters(key, valArr);
          if (isEqual(key, 'eventCalendars')) {
            Context.setAllCalendarSelected(true);
          }
        });
      }
    },
    context: {
      debounceKey: 'GET_FILTERS',
      debounceTimeout: 500,
    },
  });

  const isAllSelected = (name) => {
    return isEqual(Context.filters[name].length, data.community[name].length);
  };

  const onItemClick = (name, id) => {
    const filterArr = Context.filters[name];
    const index = indexOf(filterArr, id);
    const newArr =
      index >= 0 ? filterArr.filter((_, i) => i !== index) : [...filterArr, id];
    Context.updateFilters(name, newArr);

    if (isEqual(name, 'eventCalendars')) {
      Context.setAllCalendarSelected(isAllSelected(name));
    }
  };

  const onAllClick = (name) => {
    const filterArr = isAllSelected(name)
      ? []
      : map(data.community[name], '_id');
    Context.updateFilters(name, filterArr);

    if (isEqual(name, 'eventCalendars')) {
      Context.setAllCalendarSelected(isAllSelected(name));
    }
  };

  const { calendar } = Context.pageState;

  const setSidebarExpanded = (event, expanded, itemName) => {
    Context.setPageState('calendar', `sidebar${itemName}Expanded`, expanded);
  };

  return (
    <>
      {filterOptions.map((item) => (
        <StyledExpansion
          key={item.name}
          id={'Em_expander-' + item.name}
          summary={item.summary}
          expanded={calendar[`sidebar${item.name}Expanded`] ?? false}
          onChange={(event, expanded) =>
            setSidebarExpanded(event, expanded, item.name)
          }
          details={
            <List style={{ width: '100%' }}>
              {data && data.community ? (
                <>
                  <ListItem
                    button
                    onClick={() => onAllClick(item.name)}
                    style={{ padding: 0 }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        color="primary"
                        checked={isAllSelected(item.name)}
                      />
                    </ListItemIcon>
                    <ListItemText primary={`All ${item.summary}`} />
                  </ListItem>

                  {data.community[item.name].map((fil) => (
                    <ListItem
                      key={fil._id}
                      button
                      onClick={() => onItemClick(item.name, fil._id)}
                      style={{ padding: 0 }}
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={includes(
                            Context.filters[item.name],
                            fil._id,
                          )}
                          color="primary"
                        />
                      </ListItemIcon>
                      <ListItemText primary={fil.name} />
                    </ListItem>
                  ))}
                </>
              ) : (
                <CircularProgress />
              )}
            </List>
          }
        />
      ))}
    </>
  );
}

export default AdvancedFilters;
