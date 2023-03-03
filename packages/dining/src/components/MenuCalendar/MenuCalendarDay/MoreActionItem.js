import React from 'react';
import cx from 'clsx';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function MoreActionItem({ label, icon, onClick, color, id }) {

  const classes = useStyles();

  return (
    <Box
      display="grid"
      gridTemplateColumns="18px auto"
      gridGap="2px"
      alignItems="center"
      px={1.5}
      py={0.5}
      className={classes.actionItem}
      onClick={onClick}
      color={color}
      id={id}
    >
      <FontAwesomeIcon 
        icon={icon} 
        fontWeight="bold" 
        className={cx(classes.actionIcons)}
        style={{ color }}
      />
      <Typography 
        variant="caption"
        className={classes.label}
        style={{ color }}
      >
        {label}
      </Typography>
    </Box>
  );
}

const useStyles = makeStyles(() => ({
  actionIcons: {
    fontSize: '12px',
    cursor: 'pointer',
    color: 'rgba(0, 0, 0, 0.87)'
  },
  actionItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#F2F2F2',
    },
  },
  label: {
    color: 'rgba(0, 0, 0, 0.87)'
  }
}));
