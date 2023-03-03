/** @format */

import React, { useContext } from 'react';
import State from './StateProvider';
import { NavLink, useRouteMatch, useHistory } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  Collapse,
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { drawerOptions } from '../utils/componentData';
import Sidebar from './Sidebar';

const ACTIVE_BACKGROUND = 'rgba(0, 0, 0, 0.14)';

function EventDrawer(props) {
  const {
    eventName,
    drawerOpen,
    setDrawerOpen,
    setSelectedDrawer,
    isPastSignupsEndDate,
  } = props;
  const isMobile = useMediaQuery('(max-width:960px)');
  const Context = useContext(State);
  const history = useHistory();
  const match = useRouteMatch();
  const { location } = history;
  const { search: searchParams } = location;

  const itemOnClick = (name, isMenu) => {
    setSelectedDrawer(name);
    if (isMobile && !isMenu) {
      setDrawerOpen(false);
    }
  };

  React.useEffect(() => {
    setDrawerOpen(!isMobile);
    // eslint-disable-next-line
  }, [isMobile]);

  const getDisabled = (option) =>
    ((Context.editRecurring || props.isNewEvent) &&
      option.disabledOnCreation) ||
    (isPastSignupsEndDate && option.disabledIfPastSignupsEndDate);

  return (
    <Sidebar open={drawerOpen} setOpen={setDrawerOpen}>
      <Box fontSize="28px" marginTop="25px" padding="75px 20px 25px">
        {eventName}
      </Box>
      <List>
        {drawerOptions.map((option) => (
          <ContainedCollapse
            key={`event-drawer-${option.name}`}
            searchParams={searchParams}
            option={option}
            itemOnClick={itemOnClick}
            match={match}
            disabled={getDisabled(option)}
          />
        ))}
        <Divider style={{ marginTop: 25 }} />
      </List>
    </Sidebar>
  );
}

function ContainedCollapse(props) {
  const { option, match } = props;
  const [open, setOpen] = React.useState(false);

  const navLinkProps = {
    exact: true,
    to: match.url + option.to + props.searchParams,
    component: NavLink,
    activeStyle: { backgroundColor: ACTIVE_BACKGROUND },
  };

  const ListItemProps = option.children ? {} : navLinkProps;
  return (
    <>
      <ListItem
        key={option.text}
        id={`EM_eventDrawer-${option.id}`}
        button
        {...ListItemProps}
        disabled={props.disabled}
        onClick={() => {
          setOpen(!open);
          props.itemOnClick(option.text, option.menu);
        }}
      >
        <ListItemText primary={option.text} />
        {option.children && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      {option.children && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {option.children.map((child) => {
              return (
                <ListItem
                  key={child.text}
                  id={`EM_eventDrawer-${option.id}-${child.id}`}
                  style={{ paddingLeft: '20%' }}
                  component={NavLink}
                  exact
                  activeStyle={{ backgroundColor: ACTIVE_BACKGROUND }}
                  to={match.url + option.to + child.to + props.searchParams}
                  button
                  onClick={() => props.itemOnClick(option.text)}
                >
                  <ListItemText primary={child.text} />
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      )}
    </>
  );
}

export default EventDrawer;
