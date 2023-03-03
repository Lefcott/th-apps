/** @format */

import { Menu, MenuItem } from '@material-ui/core';
import React from 'react';
import { useFlags } from '@teamhub/api';
import { useHistory } from 'react-router-dom';
import BaseButton from './base/BaseButton';
import { ArrowDropDown } from '@material-ui/icons';
import { IntegrationsContext } from '../contexts/IntegrationsProvider';

export default function ActionMenu(props) {
  const history = useHistory();
  const flags = useFlags();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { integrations } = React.useContext(IntegrationsContext);
  const { staffIntegrationEnabled = false } = integrations;

  function handleOpen(evt) {
    setAnchorEl(evt.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function onItemClick(value) {
    history.push(value);
    setAnchorEl(null);
  }

  const menuItems = [
    {
      label: 'Staff Member',
      value: '/staff/new',
      hidden: staffIntegrationEnabled,
    },
    {
      label: 'Alexa Contact',
      value: '/alexa/new',
      hidden: !flags['alexa-calling'],
    },
  ];

  return (
    <>
      <BaseButton
        onClick={handleOpen}
        id="SD_action-menu-btn"
        style={{
          padding: '0.5rem 1rem',
        }}
      >
        ADD NEW
        <ArrowDropDown
          style={{
            marginLeft: '0.5rem',
          }}
        />
      </BaseButton>
      <Menu
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        MenuListProps={{
          style: {
            padding: 0,
          },
        }}
      >
        {menuItems
          .filter((x) => !x.hidden)
          .map((item) => (
            <MenuItem
              id={`action-btn-${item.label.toLowerCase().replace(' ', '-')}`}
              key={item.value}
              onClick={() => onItemClick(item.value)}
              style={{
                fontSize: '14px',
                padding: '0.75rem 1.25rem',
              }}
            >
              {item.label}
            </MenuItem>
          ))}
      </Menu>
    </>
  );
}
