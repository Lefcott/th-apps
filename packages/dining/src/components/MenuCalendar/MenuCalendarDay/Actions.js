import React from 'react';
import { Popover, Box } from '@material-ui/core';
import { MoreVertRounded } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCopy, faPaste } from '@fortawesome/pro-light-svg-icons';
import Strings from '../../../constants/strings';
import MoreActionItem from './MoreActionItem';
import { useStyles } from './styles';

export default function Actions({
  day,
  meal,
  openMoreActionsPopover,
  anchorMoreActionsPopover,
  onClose,
  onEdit,
  onCopy,
  onPaste,
  onClear,
  onClickMore,
  displayMoreActions,
  displayCopy,
  displayPaste,
  displayClear,
}) {

  const classes = useStyles();

  return (
    <Box className={classes.actions}>
      <FontAwesomeIcon
        icon={faEdit}
        className={classes.actionIcons}
        onClick={onEdit}
        id={`menu-cell-${day}-${meal.name}-edit`}
      />
      {displayMoreActions &&
        <>
          <MoreVertRounded
            onClick={onClickMore}
            className={classes.moreIconRoot}
            id={`menu-cell-${day}-${meal.name}-more-actions`}
          />
          <Popover
            open={openMoreActionsPopover}
            anchorEl={anchorMoreActionsPopover}
            onClose={onClose}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <Box display="flex" flexDirection="column" py={0.5}>
              {displayCopy &&
                <MoreActionItem
                  onClick={onCopy}
                  icon={faCopy}
                  label={Strings.MenuCell.moreActions.copy}
                  id={`menu-cell-${day}-${meal.name}-copy`}
                />
              }
              {displayPaste &&
                <MoreActionItem
                  onClick={onPaste}
                  icon={faPaste}
                  label={Strings.MenuCell.moreActions.paste}
                  id={`menu-cell-${day}-${meal.name}-paste`}
                />
              }
              {displayClear &&
                <MoreActionItem
                  onClick={onClear}
                  icon={faTrash}
                  label={Strings.MenuCell.moreActions.clear}
                  color="#C62828"
                  id={`menu-cell-${day}-${meal.name}-clear`}
                />
              }
            </Box>
          </Popover>
        </>
      }
    </Box>
  );
}