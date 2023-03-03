/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';

const StyledListItem = styled(ListItem)`
  && {
    border-left: solid #00838a;
    border-width: 0 0 0 7px;
    padding-left: 9px;
  }
`;

const ListItemWrapper = styled.div`
  margin: 8px 15px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  background: #fff;
`;

const AddNewListItem = ({ isHidden }) =>
  isHidden ? null : (
    <ListItemWrapper>
      <StyledListItem>
        <ListItemAvatar>
          <Avatar alt="newRes avatar" />
        </ListItemAvatar>
        <ListItemText primary={<strong>Name</strong>} secondary="Address" />
      </StyledListItem>
    </ListItemWrapper>
  );

AddNewListItem.propTypes = {
  isHidden: PropTypes.bool.isRequired,
};

export default AddNewListItem;
