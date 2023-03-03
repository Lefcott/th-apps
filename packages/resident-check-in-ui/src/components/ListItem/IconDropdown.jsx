import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem, IconButton } from '@material-ui/core';

const IconDropdown = props => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const openMenu = e => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    if (props.menuOnClick) {
      props.menuOnClick();
    }
  }

  const closeMenu = () => setAnchorEl(null);

  return (
    <>
      <IconButton {...props.buttonprops} onClick={openMenu}>
        { props.icon }
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={closeMenu}>
        { props.menuItems.map(item => (
          <MenuItem key={item.alias} className={item.className} onClick={() => { closeMenu(); props.itemOnClick(item.alias) }}>
            { item.name }
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

IconDropdown.propTypes = {
  icon: PropTypes.element.isRequired,
  menuItems: PropTypes.array.isRequired,
  itemOnClick: PropTypes.func.isRequired,
  menuOnClick: PropTypes.func
};

export default IconDropdown;