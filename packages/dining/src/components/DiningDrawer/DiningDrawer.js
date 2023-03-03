/** @format */

import styled from '@emotion/styled';
import {
  Box,
  Button,
  Divider,
  Drawer as MuiDrawer,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import React from 'react';

const Drawer = withStyles(() => ({
  paper: {
    width: '25%',
  },
}))(MuiDrawer);

const DrawerHeader = withStyles((theme) => ({
  root: {
    color: '#000',
    fontWeight: 500,
    lineHeight: `${theme.spacing(3)}px`,
    letter: '0.15px',
    flex: 1,
  },
}))(Box);

const DrawerAction = withStyles((theme) => ({
  root: {
    backgroundColor: '#EDECFB',
    color: theme.palette.primary.main,
  },
  startIcon: {
    fontSize: '1rem',
  },
}))(Button);

const AddIcon = withStyles({
  root: {
    fontSize: '1rem',
  },
})(Add);

const DrawerForm = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const DrawerActionText = withStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    fontWeight: 500,
    fontSize: '0.75rem',
  },
}))(Typography);

export default function DiningDrawer({
  id,
  open,
  children,
  onSubmit,
  onClose,
  headerText,
  drawerAction,
  footerRenderer,
}) {
  return (
    <Drawer id={id} anchor="right" open={open} onClose={onClose}>
      <DrawerForm onSubmit={onSubmit}>
        <Box padding={2.5} display="flex" alignItems="center">
          <DrawerHeader id="DN_Restaurants-SetupText">
            {headerText}
          </DrawerHeader>
          {drawerAction && (
            <DrawerAction
              disabled={drawerAction.disabled}
              onClick={drawerAction.onClick}
              id="dining_drawer_addbtn"
            >
              <AddIcon />
              <DrawerActionText variant="body1">
                {drawerAction.text}
              </DrawerActionText>
            </DrawerAction>
          )}
        </Box>

        <Divider />

        <Box flex={1} overflow="auto">
          {children}
        </Box>

        <Divider />

        {footerRenderer ? footerRenderer() : null}
      </DrawerForm>
    </Drawer>
  );
}
