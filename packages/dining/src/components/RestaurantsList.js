/** @format */
import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
/** @format */
import { DescriptionOutlined } from '@material-ui/icons';
import { MenuContext } from '../contexts/MenuContext';
import { RestaurantContext } from '../contexts/RestaurantContext';
import { sendPendoEvent } from '@teamhub/api';
import Strings from '../constants/strings';

const RestaurantName = withStyles({
  root: {
    color: 'rgba(0, 0, 0, 0.87)',
  },
})(ListItem);

/** @format */

/** @format */

export const BaseList = withStyles(() => ({
  root: {
    marginTop: 0,
    paddingTop: 0,
    marginBottom: '1rem',
  },
}))(List);

export const BaseListItem = withStyles(() => ({
  root: {
    width: 'calc(100% - 10px)',
    marginLeft: '5px',
    marginTop: '2px',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '5px',
    backgroundColor: (props) =>
      props.active ? 'rgba(76, 67, 219, 0.1)' : 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(76, 67, 219, 0.1)',
    },
  },
}))(ListItem);

export const BaseListItemIcon = withStyles((theme) => ({
  root: {
    minWidth: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: (props) => (props.active ? theme.palette.primary.main : '#000'),
  },
}))(ListItemIcon);

export const BaseListItemText = withStyles((theme) => ({
  primary: {
    fontSize: '0.85rem',
    marginLeft: (props) => (props.disabled ? '1.5rem' : 0),
    color: (props) => resolveColor(props, theme),
  },
}))(ListItemText);

function resolveColor(props, theme) {
  if (props.disabled) {
    return 'rgba(158, 158, 158, 1)';
  }
  if (props.active) {
    return theme.palette.primary.main;
  } else {
    return '#000';
  }
}

export default function RestaurantList({ restaurants }) {
  const { currentMenu, setCurrentMenu } = React.useContext(MenuContext);
  const { setCurrentRestaurant } = React.useContext(RestaurantContext);

  const handleClickMenu = React.useCallback(
    (restaurant, menu) => () => {
      sendPendoEvent(Strings.Dining.pendoEvent.menu.menuOpen);
      setCurrentRestaurant(restaurant);
      setCurrentMenu(menu);
    },
    []
  );

  function isActive(menu) {
    return menu?._id === currentMenu?._id ? menu._id : undefined;
  }

  return (
    <List>
      {restaurants.map((restaurant) => (
        <Box key={restaurant._id}>
          <RestaurantName key={restaurant._id}>
            {restaurant.name}
          </RestaurantName>
          <BaseList>
            {restaurant.menus.length ? (
              restaurant.menus.map((menu) => (
                <BaseListItem
                  key={menu._id}
                  onClick={handleClickMenu(restaurant, menu)}
                  active={isActive(menu)}
                >
                  <BaseListItemIcon active={isActive(menu)}>
                    <DescriptionOutlined fontSize="small" />
                  </BaseListItemIcon>
                  <BaseListItemText variant="caption" active={isActive(menu)}>
                    {menu.name}
                  </BaseListItemText>
                </BaseListItem>
              ))
            ) : (
              <BaseListItemText disabled variant="caption">
                No Menus
              </BaseListItemText>
            )}
          </BaseList>
        </Box>
      ))}
    </List>
  );
}
