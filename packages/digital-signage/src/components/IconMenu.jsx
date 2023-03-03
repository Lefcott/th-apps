/** @format */

import React, { Component } from 'react';
import styled from '@emotion/styled';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import withWidth from '@material-ui/core/withWidth';

const Image = styled.img`
  position: relative;
  bottom: 2px;
  right: 10px;
  width: 20px;
  padding-left: 5px;
`;

class IconMenu extends Component {
  state = {
    anchorEl: null,
  };

  openMenu = (anchorEl) => this.setState({ anchorEl });

  closeMenu = () => this.setState({ anchorEl: null });

  render() {
    const { icon, items, dialog, data, width } = this.props;

    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <>
        <Tooltip placement="bottom" disableFocusListener title="">
          <IconButton
            onClick={(e) => {
              this.openMenu(e.currentTarget);
            }}
          >
            {icon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open && width !== 'xs'}
          onClose={this.closeMenu}
        >
          {items.map((item, i) => {
            return (
              <MenuItem
                key={i}
                onClick={() => {
                  this.closeMenu();
                  item.action(data);
                }}
              >
                <Image src={item.dropdownProperties.icon} alt="icons" />
                <span style={item.style}> {item.name} </span>
              </MenuItem>
            );
          })}
        </Menu>
      </>
    );
  }
}

export default withWidth()(IconMenu);
