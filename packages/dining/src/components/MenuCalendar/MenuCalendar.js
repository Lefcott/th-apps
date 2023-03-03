/** @format */

import { Box } from '@material-ui/core';
import React from 'react';
import { DateTime } from 'luxon';
import { isEmpty, cloneDeep } from 'lodash';
import MenuCalendarMeals from './MenuCalendarMeals';
import MenuCalendarToolbar from './MenuCalendarToolbar';
import MenuCalendarWeekDays from './MenuCalendarWeekDays';
import MenuCalendarViewSelector, {
  ViewIntent,
} from './MenuCalendarViewSelector';
import IntegrationAlerts from '../IntegrationAlerts';

import { GET_AVAILABLE_MENU_ITEM } from '../../graphql/menuItem';
import { REMOVE_MENU } from '../../graphql/menu';

import { RestaurantContext } from '../../contexts/RestaurantContext';
import { MenuContext } from '../../contexts/MenuContext';
import { MenuItemContext } from '../../contexts/MenuItemContext';
import { IntegrationsContext } from '../../contexts/IntegrationsProvider';
import { getCommunityId, useCurrentUser, sendPendoEvent } from '@teamhub/api';
import { useQuery, useMutation } from '@teamhub/apollo-config';
import { showToast } from '@teamhub/toast';
import DeleteMenu from './DeleteMenu';
import MenuCalendarInformation from './MenuCalendarInformation';
import Strings from '../../constants/strings';

export default function MenuCalendar({
  onMenuDrawerOpen,
  onMenuItemDrawerOpen,
}) {
  const communityId = getCommunityId();
  const [currentIntent, setCurrentIntent] = React.useState(
    ViewIntent.EDIT_SCHEDULE
  );
  const [user] = useCurrentUser();
  const { currentMenu, setCurrentMenu } = React.useContext(MenuContext);
  const { restaurants } = React.useContext(RestaurantContext);
  const { enabledDiningIntegrations } = React.useContext(IntegrationsContext);
  const { setMenuSections, setRefetchMenuSections } =
    React.useContext(MenuItemContext);
  const [currentWeek, setCurrentWeek] = React.useState(1);
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);
  const [menuToDelete, setMenuToDelete] = React.useState(null);
  const initialStartDate = DateTime.fromISO(
    currentMenu.availability.startDate,
    { zone: user?.community?.timezone?.name || 'America/New_York' }
  );

  let startDate;
  if (initialStartDate.weekday === 7) {
    // If the initial start date is sunday
    startDate = initialStartDate.plus({ weeks: currentWeek - 1 });
  } else {
    startDate = initialStartDate
      .startOf('week')
      .minus({ days: 1 })
      .plus({ weeks: currentWeek - 1 });
  }

  const {
    data: dataMenuItems,
    loading: loadingMenuItems,
    refetch: refetchMenuItems,
  } = useQuery(GET_AVAILABLE_MENU_ITEM, {
    variables: {
      communityId,
      restaurantId: currentMenu.restaurant._id,
      menuId: currentMenu._id,
      anchorDate: startDate.toISO(),
    },
    fetchPolicy: 'network-only',
  });

  const initialMenuSections =
    dataMenuItems?.community?.restaurant?.menu?.sections || [];

  const menuSections = React.useMemo(() => {
    return initialMenuSections.map(({ availableMenuItems, ...otherProps }) => {
      const menuSection = {
        ...cloneDeep(otherProps),
      };

      availableMenuItems.forEach((menuItem) => {
        const dayActive = menuItem?.availability?.dayActive;
        if (Number.isInteger(dayActive)) {
          const weekDayActive = dayActive % 7;
          if (menuSection[`day${weekDayActive}`]) {
            menuSection[`day${weekDayActive}`].push(cloneDeep(menuItem));
          } else {
            menuSection[`day${weekDayActive}`] = [cloneDeep(menuItem)];
          }
        }
      });

      return menuSection;
    });
  }, [initialMenuSections]);

  React.useEffect(() => {
    if (!loadingMenuItems && !loadingRemovalSubmission) {
      setMenuSections(menuSections);
      setRefetchMenuSections({ refetch: refetchMenuItems });
    }
  }, [loadingMenuItems, refetchMenuItems, loadingRemovalSubmission]);

  React.useEffect(() => {
    if (currentMenu) {
      setMenuToDelete(currentMenu);
    }
  }, [currentMenu]);

  const [removeMenu, { loading: loadingRemovalSubmission }] = useMutation(
    REMOVE_MENU,
    {
      async onCompleted() {
        await handleCompletedMutation();
        let menus = restaurants.reduce((list, curr) => {
          list.push(...curr.menus);
          return list;
        }, []);
        menus = menus.filter((menu) => {
          return menu._id != currentMenu._id;
        });
        setCurrentMenu(menus[0]);
      },
    }
  );

  async function handleCompletedMutation() {
    showToast(Strings.Menu.delete);
    setConfirmationOpen(false);
  }

  function closeDialog() {
    sendPendoEvent(Strings.Dining.pendoEvent.menu.deleteCancel);
    setConfirmationOpen(false);
  }
  function openDialog() {
    sendPendoEvent(Strings.Dining.pendoEvent.menu.delete);
    setConfirmationOpen(true);
  }

  const handleRemove = () => {
    sendPendoEvent(Strings.Dining.pendoEvent.menu.deleted);
    removeMenu({
      variables: {
        communityId: getCommunityId(),
        input: {
          id: currentMenu._id,
        },
      },
    });
  };

  const lastUpdatedIntegrationTime = _.get(
    initialMenuSections?.reduce((previous, current) => {
      _.forOwn(current, (day) => {
        _.isArray(day)
          ? (previous = previous.concat(
              _.get(_.find(day, 'createdAt'), 'createdAt')
            ))
          : null;
      });
      return previous;
    }, []),
    '[0]'
  );

  return (
    <>
      {!isEmpty(enabledDiningIntegrations) && (
        <IntegrationAlerts
          lastUpdatedIntegrationTime={lastUpdatedIntegrationTime}
        ></IntegrationAlerts>
      )}
      <DeleteMenu
        currentMenu={menuToDelete}
        open={confirmationOpen}
        onClose={closeDialog}
        handleDeleteClick={handleRemove}
      />

      <Box
        p={3}
        pt={1.5}
        pb={1.5}
        display="flex"
        flex={1}
        flexDirection="column"
        maxHeight="100%"
        boxSizing="border-box"
      >
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <MenuCalendarInformation
            menu={currentMenu.name}
            restaurant={currentMenu.restaurant.name}
          />
          <Box display="flex" flexDirection="row">
            <MenuCalendarViewSelector
              setCurrentIntent={setCurrentIntent}
              currentIntent={currentIntent}
              onClick={openDialog}
            />
          </Box>
        </Box>
        <Box>
          <MenuCalendarToolbar
            onMenuDrawerOpen={onMenuDrawerOpen}
            currentWeek={currentWeek}
            setCurrentWeek={setCurrentWeek}
          />
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          flex={1}
          maxHeight="calc(100% - 96px)"
        >
          <MenuCalendarWeekDays />
          <MenuCalendarMeals
            onMenuItemDrawerOpen={onMenuItemDrawerOpen}
            currentWeek={currentWeek}
            menuSections={menuSections}
          />
        </Box>
      </Box>
    </>
  );
}
