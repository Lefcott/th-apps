/** @format */

import React from 'react';
import { useHistory } from 'react-router-dom';
import { StyledBar, IconWrapper, AppBarHeader } from './styleUtils';
import { Toolbar, Button } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

function EventAppBar(props) {
  const history = useHistory();
  const {
    location: { search: searchParams },
  } = history;

  return (
    <StyledBar position="static">
      <Toolbar>
        <IconWrapper>
          <ArrowBack onClick={() => history.push(`/${searchParams}`)} />
        </IconWrapper>
        <AppBarHeader>{props.header}</AppBarHeader>
        <IconWrapper>
          <Button onClick={() => props.setDrawerOpen(true)}>menu</Button>
        </IconWrapper>
      </Toolbar>
    </StyledBar>
  );
}

export default EventAppBar;
