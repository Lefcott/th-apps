/** @format */

import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  Hidden,
  useMediaQuery,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { get, startCase } from 'lodash';
import { Header, Wrapper, FormContainer } from '../components/styleUtils';
import EventAppBar from '../components/EventAppBar';
import CalendarTable from '../components/Settings/CalendarTable';
import EventTypeTable from '../components/Settings/EventTypeTable';
import { Route, useRouteMatch, NavLink, useHistory } from 'react-router-dom';
import LocationTable from '../components/Settings/LocationTable';
import { getOneSearchParam } from '../utils/url';
import { GET_FILTERS } from '../graphql/events';
import { useQuery } from '@teamhub/apollo-config';
import Sidebar from '../components/Sidebar';
import { useFlags } from '@teamhub/api';
import strings from '../constants/strings';

const StyledName = styled.div`
  font-size: 28px;
  margin-top: 25px;
  padding: 75px 20px 25px;
`;

const settingsOptions = [
  {
    name: 'calendars',
    text: 'Calendars',
  },
  {
    name: 'event-types',
    text: 'Event Types',
  },
  {
    name: 'locations',
    text: 'Locations',
  },
];

function SettingsPage() {
  const match = useRouteMatch();
  const isMobile = useMediaQuery('(max-width:960px)');
  const history = useHistory();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const drawer = match.params[0].slice(0, -1);
  const communityId = getOneSearchParam('communityId', '14');
  const { data, refetch } = useQuery(GET_FILTERS, {
    variables: { communityId },
  });
  const { 'teamhub-resident-groupings': residentGroupsEnabled } = useFlags();
  const calendars = get(data, 'community.eventCalendars', []);
  const eventTypes = get(data, 'community.eventTypes', []);
  const locations = get(data, 'community.eventLocations', []);
  const careSettings = get(data, 'community.careSettings', []);
  const residentGroups = residentGroupsEnabled
    ? get(data, 'community.residentGroups.nodes', [])
    : [];

  const itemOnClick = () => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  };
  return (
    <Box
      display="flex"
      overflow="hidden"
      height="100%"
      flexDirection={isMobile ? 'column' : 'row'}
    >
      <Sidebar open={drawerOpen} setOpen={setDrawerOpen}>
        <StyledName>{strings.Settings.title}</StyledName>
        <List>
          {settingsOptions.map((option) => (
            <ListItem
              key={option.name}
              button
              id={`EM_settingsDrawer-${option.name}`}
              selected={match.url.includes(option.name)}
              onClick={() => itemOnClick(option.text)}
              component={NavLink}
              exact
              to={`/settings/${option.name}/${history.location.search}`}
            >
              <ListItemText primary={option.text} />
            </ListItem>
          ))}
        </List>
      </Sidebar>

      <Hidden mdUp>
        <EventAppBar header={startCase(drawer)} setDrawerOpen={setDrawerOpen} />
      </Hidden>

      <Wrapper>
        <FormContainer container>
          <Hidden xsDown>
            <Header style={{ margin: '50px 0' }} id="Em_Settings-pageHeader">
              {startCase(drawer)}
            </Header>
          </Hidden>
          {data && data.community ? (
            <>
              <Route exact path={'/settings/calendars'}>
                <CalendarTable
                  calendars={calendars.filter(
                    ({ name }) => name !== 'Unassigned',
                  )}
                  refetchFilters={refetch}
                  careSettings={careSettings}
                  residentGroups={residentGroupsEnabled ? residentGroups : []}
                  residentGroupsEnabled={residentGroupsEnabled}
                />
              </Route>
              <Route exact path={'/settings/event-types'}>
                <EventTypeTable
                  types={eventTypes.filter(({ name }) => name !== 'Unassigned')}
                  refetchFilters={refetch}
                />
              </Route>
              <Route exact path={'/settings/locations'}>
                <LocationTable locations={locations} refetchFilters={refetch} />
              </Route>
            </>
          ) : null}
        </FormContainer>
      </Wrapper>
    </Box>
  );
}

export default SettingsPage;
