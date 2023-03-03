/** @format */

import React from 'react';
import { Box, Typography } from '@material-ui/core';

import ExpandableListItem from './ExpandableListItem';
import menuItemDrawerEmptyImage from '../../images/menuItemDrawerEmpty.svg';

import { MenuItemContext } from '../../contexts/MenuItemContext';
import { MenuContext } from '../../contexts/MenuContext';
import { REMOVE_ITEM_TO_MENU } from '../../graphql/menuItem';

import { showToast } from '@teamhub/toast';
import { useMutation } from '@teamhub/apollo-config';
import { getCommunityId, sendPendoEvent } from '@teamhub/api';

import { ViewState } from './MenuItemDrawer';
import Strings from '../../constants/strings';

export default function MenuItemList({
  associatedMenuItems,
  newAssociatedMenuItems,
  setNewAssociatedMenuItems,
  setLoadingRemovingItems,
  headerTitle,
  alreadyAssociatedMenuItems,
  setCurrentView,
}) {
  const communityId = getCommunityId();
  const { currentMenu } = React.useContext(MenuContext);
  const {
    refetchMenuSections,
    setCurrentAvailableMenuItems,
    setCurrentMenuItem,
  } = React.useContext(MenuItemContext);

  const [removeItemToMenu] = useMutation(REMOVE_ITEM_TO_MENU, {
    async onCompleted() {
      refetchMenuSections?.refetch?.();
      setLoadingRemovingItems(false);
      showToast(`${headerTitle} updated`);
    },
    onError(err) {
      setLoadingRemovingItems(false);
      console.log(err);
    },
  });

  const handleRemoveItem = React.useCallback(
    async (menuItem) => {
      const nextNewAssociatedMenuItems = newAssociatedMenuItems.filter(
        (newItem) => newItem._id !== menuItem.id
      );

      if (nextNewAssociatedMenuItems.length !== newAssociatedMenuItems.length) {
        setNewAssociatedMenuItems(nextNewAssociatedMenuItems);
      } else {
        setLoadingRemovingItems(true);
        await removeItemToMenu({
          variables: {
            communityId,
            input: {
              menuId: currentMenu._id,
              menuItemId: menuItem.id,
            },
          },
        });

        const nextCurrentAvailableMenuItems = alreadyAssociatedMenuItems.filter(
          (existingItem) => existingItem._id !== menuItem.id
        );
        setCurrentAvailableMenuItems(nextCurrentAvailableMenuItems);
      }
    },
    [
      newAssociatedMenuItems,
      setNewAssociatedMenuItems,
      alreadyAssociatedMenuItems,
    ]
  );

  const handleEditItem = React.useCallback(
    (menuItem) => () => {
      sendPendoEvent(Strings.Dining.pendoEvent.menuItem.edit);
      setCurrentMenuItem(menuItem);
      setCurrentView(ViewState.FORM_EDIT);
    },
    []
  );

  return (
    <>
      {!associatedMenuItems?.length && (
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
          <Box display="flex" flexDirection="column" mt={9} mb={12}>
            <Typography variant="caption" align="center">
              Use the field above to search for existing items
            </Typography>
            <Typography variant="caption" align="center">
              or add new items.
            </Typography>
          </Box>
          <img src={menuItemDrawerEmptyImage} alt="empty icon" />
        </Box>
      )}

      {associatedMenuItems.length > 0 &&
        associatedMenuItems
          .map((menuItem) => ({
            id: menuItem._id,
            title: menuItem.name,
            badgeText: menuItem.category.name,
            content: menuItem.description,
            tags: menuItem.attributes.map((attribute) => attribute.value),
            initialMenuItem: menuItem,
          }))
          .map((item) => (
            <ExpandableListItem
              key={item.id}
              item={item}
              onDelete={handleRemoveItem}
              onEdit={handleEditItem(item.initialMenuItem)}
            />
          ))}
    </>
  );
}
