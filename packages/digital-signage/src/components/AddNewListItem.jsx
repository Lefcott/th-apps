/** @format */

import React from 'react';
import moment from 'moment-timezone';
import styled from '@emotion/styled';
import {
  Grid,
  ListItem as MuiListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Hidden,
  Typography,
} from '@material-ui/core';

const Wrapper = styled(Grid)`
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  background: rgb(255, 255, 255);
  margin: 15px;
`;

const ListItem = styled(MuiListItem)`
  border-left: solid #4c43db;
  border-width: 0 0 0 7px;
  border-radius: 4px;
  padding-left: 9px;
`;

const ImgPlaceholder = styled(Avatar)`
  width: 60px;
  height: 60px;
  margin-right: 15px;
`;

function AddNewListItem(props) {
  const { document } = props;

  return (
    <Wrapper>
      <ListItem>
        <ListItemAvatar>
          <ImgPlaceholder alt="newSchedule" />
        </ListItemAvatar>
        <ListItemText
          primary={<strong>{document.name}</strong>}
          secondary={`Edited: ${moment(document.updatedAt).format('MMM DD')}`}
        />
        <Hidden smDown>
          <Typography style={{ marginRight: 15 }}>Scheduling</Typography>
        </Hidden>
      </ListItem>
    </Wrapper>
  );
}

export default AddNewListItem;
