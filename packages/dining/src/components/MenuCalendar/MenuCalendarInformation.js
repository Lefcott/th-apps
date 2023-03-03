/** @format */

import { Box, Typography, Tooltip } from '@material-ui/core';
import { DescriptionOutlined } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import React from 'react';

const InformationText = withStyles((theme) => ({
  root: {
    fontWeight: 'normal',
    fontSize: '16px',
    color: theme.palette.text.highEmphasis,
    marginRight: theme.spacing(1.5),
  },
}))(Typography);

const MenuIcon = withStyles((theme) => ({
  root: {
    fontWeight: 'normal',
    fontSize: '18px',
    color: theme.palette.text.highEmphasis,
    margin: '0 6px 5px 0',
  },
}))(DescriptionOutlined);

const InformationTooltip = withStyles({
  tooltipPlacementBottom: {
    margin: '4px 0',
    fontSize: '14px',
  },
})(Tooltip);

export default function MenuCalendarInformation({ restaurant, menu }) {
  return (
    <Box display="flex" flexDirection="row" alignItems="end" mb={0.5}>
      {restaurant.length > 20 ? (
        <InformationTooltip title={restaurant} interactive>
          <InformationText>
            {`${restaurant.substring(0, 20)}...`}
          </InformationText>
        </InformationTooltip>
      ) : (
        <InformationText>{restaurant}</InformationText>
      )}
      <InformationText>{'/'}</InformationText>
      <MenuIcon />
      {menu.length > 20 ? (
        <InformationTooltip title={menu} interactive>
          <InformationText>{`${menu.substring(0, 20)}...`}</InformationText>
        </InformationTooltip>
      ) : (
        <InformationText>{menu}</InformationText>
      )}
    </Box>
  );
}
