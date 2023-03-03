/** @format */

import React, { useContext } from 'react';
import {
  Box,
  Divider,
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { isEmpty } from 'lodash';
import { withStyles } from '@material-ui/styles';
import { sendPendoEvent } from '@teamhub/api';
import InitialMenuSetup from './InitialMenuSetup';
import { SettingsOutlined } from '@material-ui/icons';
import RestaurantsList from '../components/RestaurantsList';
import RestaurantsDrawer from '../components/RestaurantsDrawer';
import { RestaurantContext } from '../contexts/RestaurantContext';
import { IntegrationsContext } from '../contexts/IntegrationsProvider';
import MenuDrawer from '../components/MenuDrawer';
import MenuItemDrawer from '../components/MenuItemDrawer';
import { MenuContext } from '../contexts/MenuContext';
import MenuCalendar from '../components/MenuCalendar/MenuCalendar';
import { Mode } from '../components/MenuDrawer/MenuDrawer';

const SideBar = withStyles({
  root: {
    borderRight: ' 1px solid #E5E5E5',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
})(Box);

const MainContent = withStyles({
  root: {
    flex: 5,
    display: 'flex',
    flexDirection: 'column',
  },
})(Box);

const SidebarDivider = withStyles({
  root: {
    background: '#E5E5E5',
  },
})(Divider);

const CapitalizedTypography = withStyles({
  root: {
    textTransform: 'capitalize',
  },
})(Typography);

const EditRestaurantsButton = withStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
  },
  label: {
    justifyContent: 'flex-start',
  },
}))(Button);

export default function RestaurantScheduler(props) {
  const [openRestaurantsDrawer, setOpenRestaurantsDrawer] = React.useState(
    false
  );
  const [openMenuDrawer, setOpenMenuDrawer] = React.useState(false);
  const [menuDrawerMode, setMenuDrawerMode] = React.useState(Mode.ADD);
  const [openMenuItemDrawer, setOpenMenuItemDrawer] = React.useState(false);

  const {
    restaurants,
    loading: loadingRestaurants,
    setCurrentRestaurant,
  } = useContext(RestaurantContext);
  const { currentMenu, setCurrentMenu } = React.useContext(MenuContext);
  const { enabledDiningIntegrations } = React.useContext(IntegrationsContext);
  const [calledRestaurants, setCalledRestaurants] = React.useState(false);

  function handleOpenMenuDrawer(open, mode) {
    setMenuDrawerMode(mode);
    setOpenMenuDrawer(open);
  }

  function handleNewMenuClick() {
    handleOpenMenuDrawer(true, Mode.ADD);
    sendPendoEvent('dining_newmenu_open');
  }

  React.useEffect(() => {
    if (!restaurants.length && !loadingRestaurants) {
      props.setCurrentView('InitialRestaurantSetup');
    } else if (restaurants.length && !loadingRestaurants) {
      if (!calledRestaurants) {
        setCurrentRestaurant(restaurants[0]);
        setCurrentMenu(restaurants[0].menus[0]);
        setCalledRestaurants(true);
      }
    }
  }, [restaurants, loadingRestaurants]);

  React.useEffect(() => {
    if (!currentMenu) {
      const menus = restaurants.reduce((list, curr) => {
        list.push(...curr.menus);
        return list;
      }, []);
      setCurrentMenu(menus[0]);
    }
  }, [restaurants]);

  return (
    <>
      {loadingRestaurants ? (
        <Box
          height="100%"
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box display="flex" flex={1} height="100%">
            <SideBar>
              <Box p={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNewMenuClick}
                  disabled={!isEmpty(enabledDiningIntegrations)}
                >
                  New Menu
                </Button>
              </Box>
              <SidebarDivider />

              <Box overflow="auto" flex={1}>
                <RestaurantsList restaurants={restaurants} />
              </Box>
              <SidebarDivider />

              <EditRestaurantsButton
                fullWidth
                id="DN_edit-Resturants-Btn"
                startIcon={<SettingsOutlined />}
                onClick={() => {
                  sendPendoEvent('dining_editrestaurants');
                  setOpenRestaurantsDrawer(true);
                }}
              >
                <Box py={2}>
                  <CapitalizedTypography>
                    Edit Restaurants
                  </CapitalizedTypography>
                </Box>
              </EditRestaurantsButton>
            </SideBar>
            <MainContent>
              {currentMenu ? (
                <MenuCalendar
                  onMenuDrawerOpen={() => {
                    handleOpenMenuDrawer(true, Mode.EDIT);
                  }}
                  onMenuItemDrawerOpen={() => setOpenMenuItemDrawer(true)}
                />
              ) : (
                <InitialMenuSetup
                  onMenuDrawerOpen={() => handleOpenMenuDrawer(true, Mode.ADD)}
                />
              )}
            </MainContent>
          </Box>
          <MenuDrawer
            open={openMenuDrawer}
            mode={menuDrawerMode}
            onClose={() => setOpenMenuDrawer(false)}
          />
          <RestaurantsDrawer
            setCurrentView={props.setCurrentView}
            open={openRestaurantsDrawer}
            onClose={() => setOpenRestaurantsDrawer(false)}
          />
          <MenuItemDrawer
            open={openMenuItemDrawer}
            onClose={() => setOpenMenuItemDrawer(false)}
          />
        </>
      )}
    </>
  );
}
