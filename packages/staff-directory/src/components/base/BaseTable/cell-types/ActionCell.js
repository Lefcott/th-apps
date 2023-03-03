/** @format */

import React, { useRef } from 'react';
import { Menu, MenuItem, IconButton, Typography, Box } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import BaseCell from './BaseCell';
import { isFunction } from 'lodash';

const useMenuStyles = makeStyles((theme) => ({
  list: {
    padding: 0,
  },
}));

const useMenuItemStyles = makeStyles((theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
  },
}));

export default function ActionCell({ value: actions, idGenerator, row }) {
  const actionCellIdGenerator = idGenerator.createWithAppendedPrefix(
    `actions-${row.id}`,
  );

  function getProp(valueOrFn) {
    return isFunction(valueOrFn) ? valueOrFn(row.original) : valueOrFn;
  }

  const menuClasses = useMenuStyles();
  const menuItemClasses = useMenuItemStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const menuItems = actions.map(({ key, label, color, onClick, disabled }) => {
    const onItemClick = () => {
      onClose();
      onClick({ data: row.original, row });
    };
    return (
      <MenuItem
        key={key}
        onClick={onItemClick}
        disabled={getProp(disabled)}
        classes={menuItemClasses}
        id={actionCellIdGenerator.getId(`item-${key}`)}
      >
        <Typography color={color}>{label}</Typography>
      </MenuItem>
    );
  });

  function onOpen({ target }) {
    setAnchorEl(target);
  }

  function onClose() {
    setAnchorEl(null);
  }

  return (
    <BaseCell>
      <Box display="flex" flexDirection="row-reverse" width="100%">
        <IconButton
          ref={anchorEl}
          onClick={onOpen}
          aria-label="menu-button"
          className="SD_listitem-menu-button"
          id={actionCellIdGenerator.getId('menu-button')}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Box>

      <Menu
        classes={menuClasses}
        onClose={onClose}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
      >
        {menuItems}
      </Menu>
    </BaseCell>
  );
}
