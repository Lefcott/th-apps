/** @format */

import React, { useState } from 'react';
import { Search, Clear, ExpandMore } from '@material-ui/icons';
import './SwipeableItem.css';
import Swipeout from 'rc-swipeout';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Menu,
  MenuItem,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  InputAdornment,
} from '@material-ui/core';

const createButton = (button, onClick) => {
  const badgeHtml = (
    <div style={button.badgeStyle}>
      <img src={button.icon} alt="swipeable" style={{ width: 30 }} />
      <div>{button.name}</div>
    </div>
  );

  const buttonObj = {
    text: badgeHtml,
    onPress: () => onClick(button.alias),
    style: button.style,
  };
  return buttonObj;
};

export const SwipeableItem = (props) => {
  const { buttons, onClick, children } = props;
  return (
    <Swipeout
      autoClose
      right={buttons.reduce((filtered, button) => {
        if (button.position === 'right') {
          const buttonObj = createButton(button, onClick);
          filtered.push(buttonObj);
        }
        return filtered;
      }, [])}
      left={buttons.reduce((filtered, button) => {
        if (button.position === 'left') {
          const buttonObj = createButton(button, onClick);
          filtered.push(buttonObj);
        }
        return filtered;
      }, [])}
    >
      {children}
    </Swipeout>
  );
};

export const DropdownSelect = (props) => (
  <FormControl {...props.controlprops} variant={props.variant}>
    <InputLabel {...props.inputlabelprops}>{props.label}</InputLabel>
    <Select {...props} value={props.value} onChange={props.onChange}>
      {props.children}
    </Select>
    {props.helperText ? (
      <FormHelperText>{props.helperText}</FormHelperText>
    ) : null}
  </FormControl>
);

export const SearchBar = ({
  showSearchIcon = true,
  disableUnderline = false,
  inputStyle = {},
  ...props
}) => (
  <TextField
    {...props}
    placeholder={props.placeholder}
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
    InputProps={{
      disableUnderline,
      style: inputStyle,
      endAdornment: (
        <InputAdornment position="end">
          {props.value.length === 0 ? (
            showSearchIcon && <Search />
          ) : (
            <Clear
              style={{ cursor: 'pointer' }}
              onClick={() => props.onChange('')}
            />
          )}
        </InputAdornment>
      ),
    }}
  />
);

export const IconDropdown = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const openMenu = (e) => {
    setAnchorEl(e.currentTarget);
    if (props.menuOnClick) {
      props.menuOnClick();
    }
  };

  const closeMenu = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        {...props.buttonprops}
        onClick={openMenu}
        className={props.className}
      >
        {props.icon}
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={closeMenu}>
        {props.menuItems.map((item) => (
          <MenuItem
            key={item.alias}
            className={item.className}
            onClick={() => {
              closeMenu();
              props.itemOnClick(item.alias);
            }}
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export const ExpansionPanel = (props) => (
  <Accordion {...props}>
    <AccordionSummary
      expandIcon={<ExpandMore />}
      id={`${props.id}-header`}
      aria-controls={`${props.id}-content`}
    >
      {props.summary}
    </AccordionSummary>

    <AccordionDetails>{props.details}</AccordionDetails>

    {props.actions ? (
      <AccordionActions>{props.actions}</AccordionActions>
    ) : null}
  </Accordion>
);
