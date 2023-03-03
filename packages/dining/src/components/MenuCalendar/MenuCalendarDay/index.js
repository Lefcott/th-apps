/** @format */

import React from 'react';
import { Box, Typography, Tooltip } from '@material-ui/core';
import cx from 'clsx';
import { showToast, showErrorToast } from '@teamhub/toast';
import { isEmpty } from 'lodash';
import { sendPendoEvent, getCommunityId } from '@teamhub/api';
import { useMutation } from '@teamhub/apollo-config';

import {
  ADD_ITEM_TO_MENU,
  REMOVE_ITEM_TO_MENU,
} from '../../../graphql/menuItem';
import { MenuItemContext } from '../../../contexts/MenuItemContext';
import { MenuContext } from '../../../contexts/MenuContext';
import Strings from '../../../constants/strings';
import { isOver } from '../../../utils/helpers';
import { ConfirmationModal } from '../../../utils/modalComponents';
import { useStyles } from './styles';
import EmptyTooltip from './EmptyTooltip';
import Actions from './Actions';

const EmptyTooltipSection = React.forwardRef(EmptyTooltip);

export default function MenuCalendarDay({
  day,
  meal,
  currentWeek,
  onEditClick,
  availableMenuItems = [],
  menuSection,
}) {
  const {
    setInfo,
    setCurrentSection,
    setCurrentAvailableMenuItems,
    copiedMenuItems,
    setCopiedMenuItems,
    refetchMenuSections,
  } = React.useContext(MenuItemContext);
  const { currentMenu } = React.useContext(MenuContext);
  const rootRef = React.useRef(null);
  const communityId = getCommunityId();
  const classes = useStyles();
  const [anchorPopoverActions, setAnchorPopoverActions] = React.useState(null);
  const openPopover = !!anchorPopoverActions;
  const [active, setActive] = React.useState(false);
  const [openPasteConfirmationModal, setOpenPasteConfirmationModal] =
    React.useState(false);
  const [openClearConfirmationModal, setOpenClearConfirmationModal] =
    React.useState(false);
  const [clearing, setClearing] = React.useState(false);
  const [pasting, setPasting] = React.useState(false);

  const [addItemToMenu] = useMutation(ADD_ITEM_TO_MENU);
  const [removeItemToMenu] = useMutation(REMOVE_ITEM_TO_MENU);

  const handleEditClick = React.useCallback(() => {
    sendPendoEvent(Strings.Dining.pendoEvent.menu.cellOpen);
    setInfo({
      currentWeek,
      currentDay: day,
      currentMeal: meal,
    });
    setCurrentSection(meal);
    setCurrentAvailableMenuItems([...availableMenuItems]);
    onEditClick();
  }, [day, meal, currentWeek, onEditClick, availableMenuItems]);

  const handleClickMoreAction = React.useCallback((event) => {
    setAnchorPopoverActions(event.currentTarget);
  }, []);

  const handleClickCopy = React.useCallback(
    (event) => {
      sendPendoEvent(Strings.Dining.pendoEvent.menuItem.menuCellCopy, {
        menuId: currentMenu._id,
      });
      closeActionsPopover(event);
      setTimeout(() => setCopiedMenuItems([...availableMenuItems]), 100);
    },
    [availableMenuItems, currentMenu]
  );

  const pasteItems = React.useCallback(
    async ({ refetch = true } = {}) => {
      await clearItems({ refetch: false });
      await Promise.all(
        copiedMenuItems.map((copiedMenuItem) =>
          addItemToMenu({
            variables: {
              communityId,
              input: {
                diningItemId: copiedMenuItem.diningItemId,
                menuId: currentMenu._id,
                sectionId: menuSection._id,
                daysActive: [(currentWeek - 1) * 7 + day],
              },
            },
          })
        )
      );
      if (refetch) {
        await refetchMenuSections?.refetch();
      }
    },
    [
      communityId,
      copiedMenuItems,
      currentMenu,
      menuSection,
      day,
      currentWeek,
      refetchMenuSections,
      clearItems,
    ]
  );

  const clearItems = React.useCallback(
    async ({ refetch = true } = {}) => {
      await Promise.all(
        availableMenuItems.map((menuItem) =>
          removeItemToMenu({
            variables: {
              communityId,
              input: {
                menuId: currentMenu._id,
                menuItemId: menuItem._id,
              },
            },
          })
        )
      );
      if (refetch) {
        await refetchMenuSections?.refetch();
      }
    },
    [currentMenu._id, availableMenuItems, refetchMenuSections]
  );

  const handleClickPaste = React.useCallback(
    async (event) => {
      if (availableMenuItems.length > 0) {
        sendPendoEvent(
          Strings.Dining.pendoEvent.menuItem.menuCellPasteConfirmation,
          { menuId: currentMenu._id }
        );
        setOpenPasteConfirmationModal(true);
        setAnchorPopoverActions(null);
      } else {
        sendPendoEvent(Strings.Dining.pendoEvent.menuItem.menuCellPaste, {
          menuId: currentMenu._id,
        });
        closeActionsPopover(event);
        setPasting(true);
        try {
          await pasteItems();
          showToast(Strings.MenuItem.change);
        } catch (error) {
          showErrorToast();
        }
        setPasting(false);
      }
    },
    [availableMenuItems, pasteItems, closeActionsPopover, currentMenu._id]
  );

  const handleClickClear = React.useCallback(async () => {
    sendPendoEvent(Strings.Dining.pendoEvent.menuItem.menuCellClear);
    setOpenClearConfirmationModal(true);
    setAnchorPopoverActions(null);
  }, []);

  const closeActionsPopover = React.useCallback((event) => {
    if (!isOver(rootRef.current, event.clientX, event.clientY)) {
      setActive(false);
    }
    setAnchorPopoverActions(null);
  }, []);

  const handleClosePopover = React.useCallback(
    (event) => {
      closeActionsPopover(event);
    },
    [closeActionsPopover]
  );

  const handleMouseEnter = React.useCallback(() => {
    if (!active) {
      setActive(true);
    }
  }, [active]);

  const handleMouseLeave = React.useCallback(() => {
    if (active) {
      setActive(false);
    }
  }, [active]);

  const handleConfirmPaste = React.useCallback(
    async (event) => {
      sendPendoEvent(Strings.Dining.pendoEvent.menuItem.menuCellPasteConfirmed);
      setPasting(true);
      try {
        await pasteItems();
        showToast(Strings.MenuItem.change);
      } catch (error) {
        showErrorToast();
      }
      setPasting(false);
      setOpenPasteConfirmationModal(false);
      closeActionsPopover(event);
    },
    [pasteItems, refetchMenuSections, closeActionsPopover, currentMenu._id]
  );

  const handleCancelPaste = React.useCallback(
    (event) => {
      sendPendoEvent(
        Strings.Dining.pendoEvent.menuItem.menuCellPasteConfirmationCancel
      );
      setOpenPasteConfirmationModal(false);
      closeActionsPopover(event);
    },
    [closeActionsPopover]
  );

  const handleCancelClear = React.useCallback(
    (event) => {
      sendPendoEvent(Strings.Dining.pendoEvent.menuItem.menuCellClearCancel);
      setOpenClearConfirmationModal(false);
      closeActionsPopover(event);
    },
    [closeActionsPopover]
  );

  const handleConfirmClear = React.useCallback(
    async (event) => {
      sendPendoEvent(Strings.Dining.pendoEvent.menuItem.menuCellClearConfirmed);
      setClearing(true);
      try {
        await clearItems({ refetch: false });
        await refetchMenuSections?.refetch();
        showToast(Strings.MenuItem.change);
      } catch (error) {
        showErrorToast();
      }
      setClearing(false);
      setOpenClearConfirmationModal(false);
      closeActionsPopover(event);
    },
    [clearItems, refetchMenuSections, closeActionsPopover]
  );

  const handleClosePasteConfirmationModal = React.useCallback(
    (event) => {
      setOpenPasteConfirmationModal(false);
      closeActionsPopover(event);
    },
    [closeActionsPopover]
  );

  const handleCloseClearConfirmationModal = React.useCallback(
    (event) => {
      setOpenClearConfirmationModal(false);
      closeActionsPopover(event);
    },
    [closeActionsPopover]
  );

  const getDay = React.useCallback(
    () => `${new Date(0, 0, day).toLocaleString('en-us', { weekday: 'long' })}`,
    [day]
  );

  const emptyToolTipMessage = Strings.Menu.emptyMessage;
  const displayMoreActions = !(
    isEmpty(availableMenuItems) && isEmpty(copiedMenuItems)
  );

  return (
    <Box
      ref={rootRef}
      className={cx(classes.root, { active })}
      ml={day === 0 ? 0 : 1}
      mr={day === 6 ? 0 : 1}
      my={1.5}
      flex={1}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id={`menu-cell-${day}-${meal.name}`}
    >
      <Actions
        day={day}
        meal={meal}
        openMoreActionsPopover={openPopover}
        anchorMoreActionsPopover={anchorPopoverActions}
        onClose={handleClosePopover}
        onClickMore={handleClickMoreAction}
        onEdit={handleEditClick}
        onCopy={handleClickCopy}
        onPaste={handleClickPaste}
        onClear={handleClickClear}
        displayMoreActions={displayMoreActions}
        displayCopy={!isEmpty(availableMenuItems)}
        displayPaste={!isEmpty(copiedMenuItems)}
        displayClear={!isEmpty(availableMenuItems)}
      />

      <Box height="100%">
        {isEmpty(availableMenuItems) && (
          <Box
            flex={1}
            textAlign={'center'}
            justifyContent={'center'}
            alignItems={'center'}
            sx={{ display: 'flex', flexDirection: 'column' }}
            style={{
              height: '100%',
              margin: 'auto',
              verticalAlign: 'middle',
            }}
          >
            <Typography
              style={{ color: 'rgb(0, 0, 0, 0.60)', fontSize: '11px' }}
            >
              Empty
            </Typography>
            <Box style={{ marginTop: '4px' }}>
              <Tooltip placement="top-start" title={emptyToolTipMessage}>
                <EmptyTooltipSection />
              </Tooltip>
            </Box>
          </Box>
        )}
        {availableMenuItems.map((menuItem) => (
          <Typography
            key={menuItem.name}
            style={{
              fontSize: '11px',
              color: 'rgba(0, 0, 0, 0.87)',
              maxWidth: '100px',
            }}
            noWrap
          >
            {menuItem.name}
          </Typography>
        ))}
      </Box>

      <Box className={classes.overlay}></Box>

      <ConfirmationModal
        open={openPasteConfirmationModal}
        title={Strings.MenuCell.copyConfirmation.title}
        content={Strings.MenuCell.copyConfirmation.content}
        onClose={handleClosePasteConfirmationModal}
        leftButtonLabel={Strings.MenuCell.button.cancel}
        rightButtonLabel={Strings.MenuCell.button.ok}
        leftButtonDisabled={pasting}
        rightButtonDisabled={pasting}
        leftButtonHandler={handleCancelPaste}
        rightButtonHandler={handleConfirmPaste}
        classes={{
          root: classes.modalRoot,
          header: classes.modalHeader,
          actions: classes.modalActions,
        }}
      />
      <ConfirmationModal
        open={openClearConfirmationModal}
        title={Strings.MenuCell.clearConfirmation.title(getDay(), meal.name)}
        content={Strings.MenuCell.clearConfirmation.content}
        onClose={handleCloseClearConfirmationModal}
        leftButtonDisabled={clearing}
        rightButtonDisabled={clearing}
        leftButtonLabel={Strings.MenuCell.button.cancel}
        rightButtonLabel={Strings.MenuCell.button.clear}
        rightButtonVariant="secondary"
        leftButtonHandler={handleCancelClear}
        rightButtonHandler={handleConfirmClear}
        classes={{
          root: classes.modalRoot,
          header: classes.modalHeader,
          content: classes.modalContent,
          actions: classes.modalActions,
        }}
      />
    </Box>
  );
}
