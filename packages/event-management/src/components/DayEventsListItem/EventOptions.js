/** @format */
import React from 'react';
import { Box, Popover, Typography } from '@material-ui/core';
import styled from '@emotion/styled';
import strings from '../../constants/strings';

const ActionItem = styled(Box)`
  display: grid;
  grid-template-columns: 48px auto;
  grid-gap: 2px;
  align-items: center;
  padding: 4px 12px;
  cursor: pointer;
  &:hover {
    background-color: #f2f2f2;
  }
`;

const EventOptions = ({ event, anchorEl, onClose, onOptionClicked }) => {
  return (
    <Popover
      open
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Box display="flex" flexDirection="column" py={0.5}>
        <ActionItem onClick={() => onOptionClicked('delete')}>
          <Typography variant="caption">{strings.Event.delete}</Typography>
        </ActionItem>
        {event.publishStatus !== 'Archived' && (
          <ActionItem onClick={() => onOptionClicked('archive')}>
            <Typography variant="caption">{strings.Event.archive}</Typography>
          </ActionItem>
        )}
      </Box>
    </Popover>
  );
};

export default EventOptions;
