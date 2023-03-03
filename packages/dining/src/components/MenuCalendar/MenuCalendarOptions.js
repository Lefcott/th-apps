/** @format */

import {
  MenuItem,
  Menu,
  FormControl,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEllipsisV } from '@fortawesome/pro-light-svg-icons';
import { withStyles } from '@material-ui/styles';
import { IntegrationsContext } from '../../contexts/IntegrationsProvider';
import React from 'react';
import { isEmpty } from 'lodash';

const OptionsMenu = withStyles({
  paper: {
    border: 'none',
    textTransform: 'capitalize',
    maxWidth: '130px',
    color: '#000',
    '&::after': {
      content: 'none',
    },
  },
})(Menu);

const MenuDeleteItem = withStyles((theme) => ({
  root: {
    color: theme.palette.secondary.dark,
    padding: '0 5px',
  },
}))(MenuItem);

const DeleteMenuIcon = withStyles((theme) => ({
  root: {
    color: theme.palette.secondary.dark,
    minWidth: '25px',
    fontSize: '14px',
  },
}))(ListItemIcon);

const DeleteMenuText = withStyles({
  root: {
    fontSize: '14px',
  },
})(ListItemText);

export default function MenuCalendarOptions({ onClick }) {
  const [openMenu, setOpenMenu] = React.useState(null);
  const { enabledDiningIntegrations } = React.useContext(IntegrationsContext);

  const handleMenuClick = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleClose = () => {
    setOpenMenu(null);
  };

  return (
    <FormControl>
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </IconButton>

      <OptionsMenu
        id="simple-menu"
        anchorEl={openMenu}
        keepMounted
        open={Boolean(openMenu)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        <MenuDeleteItem
          onClick={() => {
            onClick();
            handleClose();
          }}
          disabled={!isEmpty(enabledDiningIntegrations)}
        >
          <DeleteMenuIcon>
            <FontAwesomeIcon icon={faTrash} />
          </DeleteMenuIcon>
          <DeleteMenuText primary="Delete Menu" />
        </MenuDeleteItem>
      </OptionsMenu>
    </FormControl>
  );
}
