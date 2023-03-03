/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { SwipeableItem, IconDropdown } from './reusableComponents';
import { swipeButtons } from '../utils/componentData';
import {
  ListItem as MuiListItem,
  ListItemText as MuiListItemText,
  ListItemAvatar,
  Avatar,
  useMediaQuery,
  Hidden,
  Typography,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { isEqual, isNull } from 'lodash';
import GetAppCode from './GetAppCode';
import MoveResident from './MoveResident';
import { activeResidentVar } from '../apollo.config';

const ListItemWrapper = styled.div`
  margin: 8px 15px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  background: #fff;
`;

export function ResidentAvatar({ resident }) {
  if (isNull(resident)) return <Avatar />;
  if (
    resident.profileImage &&
    !resident.profileImage.includes(
      'https://k4connect-shared.s3.amazonaws.com/misc/profile.svg'
    )
  ) {
    return (
      <Avatar
        alt={`${resident.fullName || 'new resident'} avatar`}
        src={resident.profileImage}
      />
    );
  }
  return (
    <Avatar alt={`${resident.fullName || 'new resident'} avatar`}>
      {`${resident.firstName[0]}${resident.lastName[0]}`}
    </Avatar>
  );
}

function ListItem(props) {
  const { resident, isActive, communityId, residentIntegrationEnabled } = props;
  const isMobile = useMediaQuery('(max-width:960px)');
  const [moveModalOpen, setMoveModalOpen] = React.useState(false);
  const [appCodeModalOpen, setAppCodeModalOpen] = React.useState(false);

  function generateListItems(resident) {
    const defaultListOptions = [
      {
        name: 'Resident move',
        alias: 'move',
      },
      {
        name: 'Get app code',
        alias: 'invite',
      },
    ];

    if (resident.moveRoomPending || residentIntegrationEnabled) {
      return defaultListOptions.slice(1);
    } else {
      return defaultListOptions;
    }
  }

  const setItemStyle = () => {
    if (isActive && !isMobile) {
      return {
        borderLeft: 'solid #00838a',
        borderWidth: '0 0 0 7px',
        paddingLeft: '9px',
      };
    }
  };

  const updateCurrRes = () => {
    activeResidentVar(resident._id);
  };

  const menuItemClick = (name) =>
    isEqual(name, 'move') ? setMoveModalOpen(true) : setAppCodeModalOpen(true);

  return (
    <ListItemWrapper>
      <SwipeableItem buttons={swipeButtons} onClick={menuItemClick}>
        <MuiListItem
          key={resident._id}
          className="Rm_resident-listItem"
          divider
          button
          onClick={updateCurrRes}
          style={setItemStyle()}
        >
          <ListItemAvatar>
            <ResidentAvatar resident={resident} />
          </ListItemAvatar>

          <MuiListItemText
            primary={
              <strong className="Rm_resident-listItem-name">
                {resident.fullName || 'Name'}
              </strong>
            }
            secondary={
              <span className="Rm_resident-listItem-address">
                {resident.address || 'Address'}
              </span>
            }
          />

          {resident.moveRoomPending && (
            <Typography
              className="Rm_resident-listItem-movePending"
              color="primary"
            >
              Move pending
            </Typography>
          )}
          <Hidden xsDown>
            <IconDropdown
              icon={<MoreVert />}
              menuItems={generateListItems(resident)}
              itemOnClick={menuItemClick}
              className="Rm_resident-listItem-options"
            />
          </Hidden>
        </MuiListItem>
      </SwipeableItem>
      <GetAppCode
        open={appCodeModalOpen}
        residentId={resident._id}
        residentFirstName={resident.firstName}
        communityId={communityId}
        close={() => setAppCodeModalOpen(false)}
        className="Rm_resident-listItem-options-appCode"
      />
      <MoveResident
        resident={resident}
        open={moveModalOpen}
        communityId={communityId}
        close={() => setMoveModalOpen(false)}
        className="Rm_resident-listItem-options-residentMove"
      />
    </ListItemWrapper>
  );
}

ListItem.propTypes = {
  resident: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default ListItem;
